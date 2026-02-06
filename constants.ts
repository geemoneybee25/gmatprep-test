import { Domain, Skill, SkillStatus, TestResult } from './types';

export const calculateStatus = (p: number): SkillStatus => {
  if (p < 0.40) return SkillStatus.NOT_READY;
  if (p < 0.85) return SkillStatus.LEARNING;
  return SkillStatus.MASTERED;
};

const QUANT_SKILL_CATEGORIES: Record<string, string> = {
  "Integer Properties": "Arithmetic",
  "Fractions and Decimals": "Arithmetic",
  "Ratios and Proportions": "Arithmetic",
  "Percentages": "Arithmetic",
  "Linear Equations": "Algebra",
  "Quadratic Equations": "Algebra",
  "Inequalities": "Algebra",
  "Functions": "Algebra",
  "Sequences": "Algebra",
  "Coordinate Geometry": "Geometry",
  "Triangles and Circles": "Geometry",
  "3D Geometry": "Geometry",
  "Combinatorics": "Word Problems",
  "Probability": "Word Problems",
  "Rate Problems": "Word Problems",
  "Work Problems": "Word Problems"
};

const VERBAL_SKILL_CATEGORIES: Record<string, string> = {
  "Main Idea": "Reading Comprehension",
  "Supporting Details": "Reading Comprehension",
  "Inference": "Reading Comprehension",
  "Application": "Reading Comprehension",
  "Logical Structure": "Reading Comprehension",
  "Find the Assumption": "Critical Reasoning",
  "Strengthen the Argument": "Critical Reasoning",
  "Weaken the Argument": "Critical Reasoning",
  "Evaluate the Argument": "Critical Reasoning",
  "Draw a Conclusion": "Critical Reasoning",
  "Bold Face": "Critical Reasoning",
  "Parallel Reasoning": "Critical Reasoning"
};

const DI_SKILL_CATEGORIES: Record<string, string> = {
  "Table Analysis": "Data Sufficiency",
  "Graphics Interpretation": "Data Sufficiency",
  "Two-Part Analysis": "Multi-Source Reasoning",
  "Data Sufficiency Algebra": "Data Sufficiency",
  "Data Sufficiency Geometry": "Data Sufficiency",
  "Data Sufficiency Word Problems": "Data Sufficiency",
  "Multi-Source Reasoning": "Multi-Source Reasoning",
  "Integrated Reasoning": "Multi-Source Reasoning"
};

const QUANT_SKILL_NAMES = Object.keys(QUANT_SKILL_CATEGORIES);
const VERBAL_SKILL_NAMES = Object.keys(VERBAL_SKILL_CATEGORIES);
const DI_SKILL_NAMES = Object.keys(DI_SKILL_CATEGORIES);

const PREREQUISITE_MAP: Record<string, string[]> = {
  "Quadratic Equations": ["Linear Equations"],
  "Inequalities": ["Linear Equations"],
  "Functions": ["Linear Equations"],
  "Sequences": ["Linear Equations"],
  "Coordinate Geometry": ["Linear Equations"],
  "3D Geometry": ["Triangles and Circles"],
  "Combinatorics": ["Integer Properties"],
  "Probability": ["Combinatorics"],
  "Work Problems": ["Rate Problems"],
  "Inference": ["Main Idea", "Supporting Details"],
  "Application": ["Main Idea"],
  "Strengthen the Argument": ["Find the Assumption"],
  "Weaken the Argument": ["Find the Assumption"],
  "Evaluate the Argument": ["Find the Assumption"],
  "Bold Face": ["Logical Structure"],
  "Data Sufficiency Algebra": ["Linear Equations"],
  "Data Sufficiency Geometry": ["Triangles and Circles"],
  "Data Sufficiency Word Problems": ["Rate Problems"],
  "Multi-Source Reasoning": ["Table Analysis"]
};

export const generateMockPastTests = (): TestResult[] => {
  const quantBaseline = 75;
  const verbalBaseline = 73;
  const diBaseline = 74;
  const totalBaseline = 555;  // GMAT total score

  return [
    {
      id: 'test-1',
      date: '2024-05-15T10:00:00Z',
      totalScore: totalBaseline + 20,
      mathScore: quantBaseline + 3,
      readingScore: verbalBaseline + 2,
      diScore: diBaseline + 1,
      performanceBreakdown: [
        { topic: 'Ratios and Proportions', score: 70, averageScore: 80 },
        { topic: 'Strengthen the Argument', score: 65, averageScore: 75 },
        { topic: 'Data Sufficiency Algebra', score: 60, averageScore: 72 },
      ]
    },
    {
      id: 'test-2',
      date: '2024-04-22T14:30:00Z',
      totalScore: totalBaseline - 15,
      mathScore: quantBaseline - 2,
      readingScore: verbalBaseline - 1,
      diScore: diBaseline - 2,
      performanceBreakdown: [
        { topic: 'Quadratic Equations', score: 55, averageScore: 75 },
      ]
    }
  ];
};

export const generateMockSkills = (): Skill[] => {
  const createSkillsForDomain = (names: string[], categories: Record<string, string>, domain: Domain) => {
    return names.map((name, index) => {
      let pMastery: number;
      
      if (index < names.length * 0.3) pMastery = 0.25 + Math.random() * 0.25;
      else if (index < names.length * 0.7) pMastery = 0.55 + Math.random() * 0.25;
      else pMastery = 0.88 + Math.random() * 0.11;

      return {
        id: `${domain.toLowerCase().replace(/\s+/g, '-')}-skill-${index + 1}`,
        name,
        domain,
        category: categories[name],
        pMastery: Number(pMastery.toFixed(2)),
        status: calculateStatus(pMastery),
        lastPracticed: Math.random() > 0.3 ? new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString() : null,
        attempts: Math.floor(Math.random() * 100)
      };
    });
  };

  const quantSkills = createSkillsForDomain(QUANT_SKILL_NAMES, QUANT_SKILL_CATEGORIES, Domain.QUANT);
  const verbalSkills = createSkillsForDomain(VERBAL_SKILL_NAMES, VERBAL_SKILL_CATEGORIES, Domain.VERBAL);
  const diSkills = createSkillsForDomain(DI_SKILL_NAMES, DI_SKILL_CATEGORIES, Domain.DI);
  
  const allSkills = [...quantSkills, ...verbalSkills, ...diSkills];

  return allSkills.map(skill => {
    const prereqNames = PREREQUISITE_MAP[skill.name];
    if (prereqNames) {
      const prereqIds = prereqNames.map(pName => {
        const found = allSkills.find(s => s.name === pName);
        return found ? found.id : '';
      }).filter(id => id !== '');
      
      const allPrereqsMastered = prereqIds.every(id => {
        const prereq = allSkills.find(s => s.id === id);
        return prereq && prereq.pMastery >= 0.85;
      });

      if (!allPrereqsMastered) {
        return {
          ...skill,
          prerequisites: prereqIds,
          status: SkillStatus.NOT_READY,
          pMastery: Math.min(skill.pMastery, 0.35)
        };
      }

      return { ...skill, prerequisites: prereqIds };
    }
    return skill;
  });
};

export const INITIAL_SKILLS: Skill[] = generateMockSkills();
export const MOCK_PAST_TESTS: TestResult[] = generateMockPastTests();