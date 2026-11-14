// Default content, transcribed from docs/SiddharthAnbumaniJuly25.pdf.
// Use **double asterisks** inside any description to make text bold.

export const uid = () => Math.random().toString(36).slice(2, 10);

export const defaultResume = {
  basics: {
    name: "SIDDHARTH ANBUMANI",
    phone: "Ph: (+91) 7305175711",
    location: "Chennai | Tamil Nadu, India",
    email: "siddharthanbumani@gmail.com",
    links: [
      {
        id: "l1",
        label: "GitHub",
        url: "https://github.com/siddharthanbumani",
      },
      {
        id: "l2",
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/siddharth-anbumani-778b0124a/",
      },
    ],
  },
  summary: {
    title: "Summary of Qualifications",
    visible: true,
    text: "Innovative and driven Computer Science student, passionate about web development. Skilled in JavaScript and Python, with hands-on experience in MEAN stack projects, React & Next.js development, and frontend UI/animation using Three.js, GSAP, and modern styling frameworks. Aiming to make a meaningful impact in software engineering.",
  },
  education: {
    title: "Education",
    visible: true,
    items: [
      {
        id: "e1",
        institution: "SRM Institute of science and technology",
        location: "Ramapuram, Chennai - 600089",
        date: "(Present)",
        degree: "Bachelor of technology in Computer Science and Engineering",
        gpaLabel: "Cumulative GPA",
        gpa: "8.41/10",
      },
    ],
  },
  skills: {
    title: "Technical Skills",
    visible: true,
    items: [
      {
        id: "s1",
        title: "FULLSTACK WEB DEVELOPMENT",
        text: "Proficient in building scalable web applications using the **MERN stack (MongoDB, Express.js, React.js, Node.js)**. Experienced in developing RESTful APIs, implementing authentication and authorisation, and deploying full-stack applications. Skilled in integrating backend services with modern frontend frameworks.",
      },
      {
        id: "s2",
        title: "REACT & NEXT JS DEVELOPMENT",
        text: "Specialized in developing responsive, high-performance web apps using **React.js** and **Next.js**. Proficient in **Redux**, **Context API**, and advanced Next.js features like **SSR**, **SSG**, and **API routes**. Focused on clean architecture, reusability, performance optimization, and SEO.",
      },
      {
        id: "s3",
        title: "FRONTEND & UI ANIMATIONS",
        text: "Immersed in **Three.js** for interactive 3D graphics and **GSAP** for rich animations. Experienced with **Tailwind CSS**, **Material UI**, **Bootstrap**, **React-Bootstrap**, and **ShadCN** for crafting responsive, visually engaging interfaces",
      },
    ],
  },
  experience: {
    title: "Experience",
    visible: true,
    items: [
      {
        id: "x1",
        role: "TECHNOLOGY SUPPORT INTERN",
        company: "Waves Swim Academy",
        location: "Chennai, Tamil Nadu",
        date: "01/04/2025 – 30/11/2024",
        text: "Assisted in managing and maintaining the academy's website, ensuring optimal performance and user experience. Provided technical support for website maintenance website-related issues, including troubleshooting and resolving technical problems. Monitored website analytics to identify areas for improvement and implement necessary changes",
      },
      {
        id: "x2",
        role: "WEB DEVELOPER",
        company: "Waves Swim Academy",
        location: "Chennai, Tamil Nadu",
        date: "01/04/2025 – Present",
        text: "Redesigned and rebuilt the academy’s website by migrating from a legacy PHP system to a modern React-based SPA. Developed the site from scratch using React and Tailwind CSS, enhancing UI/UX, performance, and scalability while aligning with the academy’s brand.",
      },
    ],
  },
  projects: {
    title: "Projects",
    visible: true,
    items: [
      {
        id: "p1",
        name: "WAVES SWIM ACADEMY ( key Project )",
        text: "Redesigned the academy’s website as a responsive Single Page Application using **React** and **Tailwind CSS**. Focused on performance, modern UI/UX, and brand consistency across devices. Implemented clean routing, scalable components, and optimized layout for future expansion.",
      },
      {
        id: "p2",
        name: "DEVELOPER NEXUS",
        text: "Built a modern, developer-focused Single Page Application using **React** and **Tailwind CSS** for showcasing personal projects, technical skills, and tools. Implemented intuitive navigation, dynamic content sections, and responsive layouts for a seamless experience build it with Immersive 3d objects. Focused on clean design, scalability, and performance optimization for developers and tech enthusiasts.",
      },
    ],
  },
};

// Blank items used by the "Add" buttons in the form.
export const blankItems = {
  education: () => ({
    id: uid(),
    institution: "",
    location: "",
    date: "",
    degree: "",
    gpaLabel: "Cumulative GPA",
    gpa: "",
  }),
  skills: () => ({ id: uid(), title: "", text: "" }),
  experience: () => ({
    id: uid(),
    role: "",
    company: "",
    location: "",
    date: "",
    text: "",
  }),
  projects: () => ({ id: uid(), name: "", text: "" }),
  link: () => ({ id: uid(), label: "", url: "" }),
};

// A blank resume: every field is empty but one empty entry exists per section,
// so the editor shows placeholder text (see placeholders.js) everywhere.
export const makeBlankResume = () => ({
  basics: {
    name: "",
    phone: "",
    location: "",
    email: "",
    links: [
      { id: uid(), label: "GitHub", url: "" },
      { id: uid(), label: "LinkedIn", url: "" },
    ],
  },
  summary: { title: "Summary of Qualifications", visible: true, text: "" },
  education: { title: "Education", visible: true, items: [blankItems.education()] },
  skills: { title: "Technical Skills", visible: true, items: [blankItems.skills()] },
  experience: { title: "Experience", visible: true, items: [blankItems.experience()] },
  projects: { title: "Projects", visible: true, items: [blankItems.projects()] },
});
