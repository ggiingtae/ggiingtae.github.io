/* ============================================================
   여기만 고치면 홈페이지 내용이 바뀝니다.
   [대괄호] 로 된 부분은 본인 정보로 바꿔 주세요.
   ============================================================ */
const SITE = {
  github: 'ggiingtae',
  email: 'gtwelove0811@gmail.com',

  // GitHub 공개 저장소를 자동으로 불러와 프로젝트 목록 뒤에 붙입니다 (false 로 끄기)
  autoGithubRepos: true,

  ko: {
    kicker: '[Robotics Software] · 2026 –',
    h1: '[로봇 소프트웨어 엔지니어]',
    name: '박경태',
    role: '[소속] · [직함]',
    facts: [
      ['지금은', '[지금 하고 있는 일을 한 줄로 — 예: 4족보행 로봇의 인식·내비게이션 소프트웨어 개발]'],
      ['', '[관심 분야 — 예: SLAM, 하이트맵, 핸드아이 캘리브레이션]'],
      ['[20XX] –', '[개발을 시작한 계기나 지금까지의 흐름을 한 줄로]'],
    ],
    ctaProjects: '프로젝트 보기',
    ctaCareer: '경력',
    projTitle: '프로젝트',
    projLead: '만들어 온 것들.',
    careerTitle: '경력',
    careerLead: '걸어온 길.',
    contactTitle: '연락하기',
    contactLead: '협업, 질문, 아무 얘기나 환영합니다.',
    ghLoaded: n => `GitHub 공개 저장소 ${n}개를 자동으로 불러왔습니다.`,
    terminal: [
      ['whoami', '박경태 (Park KyoungTae)'],
      ['cat role.txt', '[로봇 소프트웨어 엔지니어]'],
      ['ls ~/interests', 'robotics/  slam/  perception/  [...]'],
      ['echo $STATUS', '🟢 building something'],
    ],
  },

  en: {
    kicker: '[Robotics Software] · 2026 –',
    h1: '[Robot Software Engineer]',
    name: 'Park KyoungTae',
    role: '[Company] · [Title]',
    facts: [
      ['Now', '[One line about what you do now]'],
      ['', '[Areas of interest — e.g. SLAM, heightmaps, hand-eye calibration]'],
      ['[20XX] –', '[How you got here, in one line]'],
    ],
    ctaProjects: 'Projects',
    ctaCareer: 'Career',
    projTitle: 'Projects',
    projLead: 'Things I have built.',
    careerTitle: 'Career',
    careerLead: 'The path so far.',
    contactTitle: 'Contact',
    contactLead: 'Collaboration, questions, or just saying hi — all welcome.',
    ghLoaded: n => `Loaded ${n} public repositories from GitHub.`,
    terminal: [
      ['whoami', 'Park KyoungTae'],
      ['cat role.txt', '[Robot Software Engineer]'],
      ['ls ~/interests', 'robotics/  slam/  perception/  [...]'],
      ['echo $STATUS', '🟢 building something'],
    ],
  },

  // 직접 적는 프로젝트. ko/en 둘 다 적거나, 하나만 적으면 양쪽에 같이 보입니다.
  projects: [
    {
      title: '[프로젝트 이름 1]',
      ko: '[무엇을, 왜 만들었는지 1~2줄]',
      en: '[What and why, 1–2 lines]',
      tags: ['C++', 'ROS'],
      link: '',
    },
    {
      title: '[프로젝트 이름 2]',
      ko: '[설명]',
      en: '[Description]',
      tags: ['Python'],
      link: '',
    },
    {
      title: '[프로젝트 이름 3]',
      ko: '[설명]',
      en: '[Description]',
      tags: ['Qt'],
      link: '',
    },
  ],

  // 위에서부터 최신순
  career: [
    { period: '[2026] – 현재', en_period: '[2026] – Present',
      org: '[회사/기관]', ko: '[직무 · 한 일]', en: '[Role · what you did]' },
    { period: '[20XX] – [20XX]', en_period: '[20XX] – [20XX]',
      org: '[회사/학교]', ko: '[직무 · 한 일]', en: '[Role · what you did]' },
    { period: '[20XX]', en_period: '[20XX]',
      org: '[학교]', ko: '[전공 · 졸업]', en: '[Major · Graduated]' },
  ],

  skills: ['C++', 'Python', 'Linux', 'ROS', 'Git', '[...]'],
};
