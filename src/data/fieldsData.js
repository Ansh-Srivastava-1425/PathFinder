// Central data repository for Dishant's tech fields detail view.
// Contains realistic data tailored for Indian engineering students.

export const fieldsData = {
  "robotics": {
    emoji: "🤖",
    name: "Robotics",
    tagline: "Build machines that move, think, and act in the physical world.",
    category: "Hardware",
    badges: {
      safety: "High Growth",
      difficulty: "Intermediate",
      isGem: true
    },
    stats: {
      entrySalary: "₹6 – 10 LPA",
      seniorSalary: "₹18 – 35 LPA",
      futureSafety: "92% Safe",
      bestBranch: "ECE / Mech / EE",
      timeToJobReady: "10-12 months"
    },
    description: "Look, robotics isn't just about making toy cars with Arduino. It's where advanced software meets real-world physics. You will be writing code to control mechanical linkages, process camera feeds in real time, and path-find around physical obstacles. If you're bored of writing simple CRUD apps and want to see your code literally move a physical arm or drive a vehicle, this is your zone. Yes, you need to understand both hardware circuits and algorithms, but that's exactly why it's a high-paying, irreplaceable field.",
    projects: [
      { badge: "Beginner", name: "PID Line Follower", description: "Build a physical or simulated robot that navigates a track smoothly using proportional-integral-derivative control algorithms." },
      { badge: "Intermediate", name: "2D SLAM Mapping Bot", description: "Use ROS (Robot Operating System) and a LiDAR sensor to map an unknown room environment in real-time." },
      { badge: "Advanced", name: "Robotic Arm Inverse Kinematics", description: "Program a 6-axis robotic arm simulator to pick up objects at specific coordinate points using trigonometry and vector math." }
    ],
    companies: [
      { name: "DRDO", type: "Government", initials: "DR", theme: "purple" },
      { name: "GreyOrange", type: "Indian Startup", initials: "GO", theme: "green" },
      { name: "Tesla India", type: "Global Dream", initials: "TS", theme: "warm" },
      { name: "ABB Robotics", type: "MNC", initials: "AB", theme: "blue" }
    ],
    salaries: [
      { level: "Entry level", amount: "₹6 – 10 LPA", ratio: 30 },
      { level: "Mid level", amount: "₹12 – 18 LPA", ratio: 55 },
      { level: "Senior level", amount: "₹18 – 35 LPA", ratio: 85 },
      { level: "Specialist", amount: "₹35+ LPA", ratio: 100 }
    ],
    futureVerdict: {
      title: "Verdict — Growing strongly",
      text: "With automation rapidly spreading across warehouses, defense, and manufacturing in India, robotics engineering is highly future-safe. AI can generate code, but translating code into physical motion safely and reliably requires deep hardware-software integration that cannot be easily automated."
    },
    people: [
      {
        avatarInitials: "AS",
        avatarTheme: "indigo",
        transformation: "Mech grad → Robotics Lead",
        role: "Lead Systems Architect at GreyOrange",
        story: "I started in Mechanical Engineering doing CAD models, but realized software was where the brain was. I self-taught C++ and ROS, built two robot simulation projects, and got hired as an intern. Don't let your branch limit you."
      },
      {
        avatarInitials: "KV",
        avatarTheme: "pink",
        transformation: "ECE grad → DRDO scientist",
        role: "Scientist C at CAIR, DRDO",
        story: "Instead of joining a mass recruitment MNC, I focused on hardware control and embedded C. Cleared GATE, showed my robotics projects in the interview, and got selected for autonomous drone defense systems."
      }
    ],
    roadmap: [
      { step: "Step 1", name: "C++ Programming & Linux Fundamentals", meta: "4 weeks • 1 Project", locked: false },
      { step: "Step 2", name: "Microcontrollers & Embedded C", meta: "6 weeks • 2 Projects", locked: false },
      { step: "Step 3", name: "ROS (Robot Operating System) Basics", meta: "8 weeks • 2 Projects", locked: false },
      { step: "Step 4", name: "Kinematics & Computer Vision Integration", meta: "Locked Step", locked: true }
    ]
  },
  "vlsi-chip-design": {
    emoji: "🔌",
    name: "VLSI / Chip Design",
    tagline: "Design the microscopic circuits powering modern high-performance microchips.",
    category: "Hardware",
    badges: {
      safety: "Extremely Safe",
      difficulty: "Advanced",
      isGem: true
    },
    stats: {
      entrySalary: "₹8 – 14 LPA",
      seniorSalary: "₹25 – 60 LPA",
      futureSafety: "97% Safe",
      bestBranch: "ECE / EE",
      timeToJobReady: "10-12 months"
    },
    description: "VLSI (Very Large Scale Integration) is the science of packing billions of transistors onto a single silicon chip. In a world where AI models require massive compute and electric vehicles need specialized processors, chip design is the ultimate high-paying hardware field. You'll learn hardware description languages like Verilog/SystemVerilog, run logic simulations, design physical chip layouts, and understand transistor physics. It requires extreme precision because a single mistake on silicon costs millions of dollars to refabricate.",
    projects: [
      { badge: "Beginner", name: "8-bit ALU Design in Verilog", description: "Implement a basic Arithmetic Logic Unit in Verilog code and simulate it with testbenches to verify addition, subtraction, and bitwise operations." },
      { badge: "Intermediate", name: "Traffic Light Controller State Machine", description: "Design a finite state machine (FSM) controller in Verilog and implement it on an FPGA board to control complex traffic intersections." },
      { badge: "Advanced", name: "MIPS Core Processor Design", description: "Build a fully functional single-cycle 32-bit MIPS processor core in SystemVerilog, verifying instructions running in simulation." }
    ],
    companies: [
      { name: "Semiconductor Lab", type: "Government", initials: "SC", theme: "purple" },
      { name: "ISRO / Dept of Space", type: "Government", initials: "IS", theme: "purple" },
      { name: "Nvidia India", type: "Global Dream", initials: "NV", theme: "warm" },
      { name: "Intel India", type: "MNC", initials: "IN", theme: "blue" },
      { name: "Qualcomm India", type: "Global Dream", initials: "QC", theme: "warm" },
      { name: "Wipro VLSI", type: "MNC", initials: "WP", theme: "blue" }
    ],
    salaries: [
      { level: "Entry level", amount: "₹8 – 14 LPA", ratio: 30 },
      { level: "Mid level", amount: "₹15 – 25 LPA", ratio: 55 },
      { level: "Senior level", amount: "₹25 – 60 LPA", ratio: 85 },
      { level: "Specialist", amount: "₹60+ LPA", ratio: 100 }
    ],
    futureVerdict: {
      title: "Verdict — Highly Irreplaceable & Funded",
      text: "As the Indian government pushes the India Semiconductor Mission (ISM) with billions of dollars in subsidies, fabrication plants and chip design centers are expanding rapidly. Building physical hardware requires specialized laboratory engineering that cannot be automated by pure software AI."
    },
    people: [
      {
        avatarInitials: "KV",
        avatarTheme: "sky",
        transformation: "ECE grad → Nvidia Lead",
        role: "Principal VLSI Architect at Nvidia India",
        story: "Everyone was running towards web development, but I stuck to Verilog and CMOS design. Showed my custom processor design in the interview and was hired instantly. Hard work in hardware pays off."
      },
      {
        avatarInitials: "DP",
        avatarTheme: "cyan",
        transformation: "EE grad → SCL Scientist",
        role: "Scientist C at Semiconductor Laboratory",
        story: "Designing circuits was my passion. Cleared GATE, specialized in microelectronics, and joined SCL. Working on space-qualified chips for India's satellites is an honor."
      }
    ],
    roadmap: [
      { step: "Step 1", name: "Digital Electronics & Logic Design", meta: "4 weeks • 1 Project", locked: false },
      { step: "Step 2", name: "Verilog HDL & Simulation Basics", meta: "5 weeks • 2 Projects", locked: false },
      { step: "Step 3", name: "FPGA Prototyping & SystemVerilog", meta: "7 weeks • 2 Projects", locked: false },
      { step: "Step 4", name: "ASIC Flow, Synthesis & Physical Design", meta: "Locked Step", locked: true }
    ]
  },
  "bioinformatics": {
    emoji: "🔬",
    name: "Bioinformatics",
    tagline: "Decode life itself — where genomics meets high-performance algorithms.",
    category: "Research",
    badges: {
      safety: "Extremely Safe",
      difficulty: "Advanced",
      isGem: true
    },
    stats: {
      entrySalary: "₹5 – 8 LPA",
      seniorSalary: "₹15 – 30 LPA",
      futureSafety: "98% Safe",
      bestBranch: "CSE / Biotech / IT",
      timeToJobReady: "12-14 months"
    },
    description: "Bioinformatics is the ultimate cross-disciplinary field. Think of it as data science, but your dataset is the human genome (which is 3 billion letters long!). You'll be using Python, R, and bash scripts to align DNA sequences, detect cancer mutations, and predict how proteins fold. If you want to use your programming skills to help cure diseases and work alongside research scientists rather than just building shopping carts, bioinformatics is incredibly fulfilling.",
    projects: [
      { badge: "Beginner", name: "DNA Sequence Alignment Tool", description: "Implement the Needleman-Wunsch algorithm from scratch in Python to find the optimal alignment between two genetic sequences." },
      { badge: "Intermediate", name: "RNA-Seq Gene Expression Analysis", description: "Use R and Bioconductor to analyze RNA expression levels in cancer vs healthy cells, identifying key upregulated genes." },
      { badge: "Advanced", name: "Protein-Ligand Docking Pipeline", description: "Build a Python pipeline to simulate how small drug molecules bind to target proteins using AutoDock Vina." }
    ],
    companies: [
      { name: "CSIR-IGIB", type: "Government", initials: "IG", theme: "purple" },
      { name: "MedGenome", type: "Indian Startup", initials: "MG", theme: "green" },
      { name: "Biocon", type: "MNC", initials: "BC", theme: "blue" },
      { name: "Schrödinger", type: "Global Dream", initials: "SD", theme: "warm" }
    ],
    salaries: [
      { level: "Entry level", amount: "₹5 – 8 LPA", ratio: 25 },
      { level: "Mid level", amount: "₹9 – 15 LPA", ratio: 50 },
      { level: "Senior level", amount: "₹15 – 30 LPA", ratio: 80 },
      { level: "Specialist", amount: "₹30+ LPA", ratio: 100 }
    ],
    futureVerdict: {
      title: "Verdict — High Academic & Industry Demand",
      text: "With personalized medicine and gene therapies scaling globally, DNA data is expanding faster than internet video. Big Pharma and genomics startups are paying premium salaries to computational biological engineers who can manage this massive data storm."
    },
    people: [
      {
        avatarInitials: "NP",
        avatarTheme: "emerald",
        transformation: "Biotech grad → Bioinformatics Specialist",
        role: "Senior Scientist at MedGenome",
        story: "I had zero coding background in bio engineering. I started learning Python for data analysis, took open source genetics datasets, and built analysis scripts. Now I help doctors diagnose rare genetic conditions."
      },
      {
        avatarInitials: "RT",
        avatarTheme: "amber",
        transformation: "CSE grad → PhD Researcher",
        role: "Research fellow at IISc Bangalore",
        story: "I loved algorithms but wanted to apply them to science. I skipped standard placements to work on computational genomics. Combining graphs and biological networks was my ticket into IISc."
      }
    ],
    roadmap: [
      { step: "Step 1", name: "Python for Data Analysis & Biopython", meta: "4 weeks • 1 Project", locked: false },
      { step: "Step 2", name: "Linux Bash & Genomic Data Formats", meta: "5 weeks • 2 Projects", locked: false },
      { step: "Step 3", name: "Sequence Alignment & Comparative Genomics", meta: "7 weeks • 2 Projects", locked: false },
      { step: "Step 4", name: "Next-Generation Sequencing (NGS) Analysis", meta: "Locked Step", locked: true }
    ]
  },
  "computer-vision": {
    emoji: "👁️",
    name: "Computer Vision",
    tagline: "Teach machines to see, analyze, and understand the physical world.",
    category: "AI & Data",
    badges: {
      safety: "High Growth",
      difficulty: "Advanced",
      isGem: true
    },
    stats: {
      entrySalary: "₹8 – 14 LPA",
      seniorSalary: "₹25 – 50 LPA",
      futureSafety: "94% Safe",
      bestBranch: "CSE / ECE / EE",
      timeToJobReady: "8-10 months"
    },
    description: "Every self-driving car, face scanner, and AI video editor relies on Computer Vision (CV). You will learn how images are processed at the pixel level, and how neural networks are trained to detect objects, segment scenes, and track movements. Rather than just applying generic APIs, you will build and fine-tune convolutional neural networks (CNNs) and transformer models that can detect a fracture in an X-ray or identify lane markings in heavy rain.",
    projects: [
      { badge: "Beginner", name: "Real-Time Object Detector", description: "Use OpenCV and YOLO to build a camera application that detects and labels multiple objects in real-time." },
      { badge: "Intermediate", name: "Medical Image Segmentation", description: "Train a U-Net model in PyTorch to identify and highlight brain tumors in MRI scans with high precision." },
      { badge: "Advanced", name: "Custom Face Recognition System", description: "Build an attendance scanner using FaceNet embeddings and a vector database for rapid identification in large groups." }
    ],
    companies: [
      { name: "ISRO", type: "Government", initials: "IS", theme: "purple" },
      { name: "Nvidia India", type: "Global Dream", initials: "NV", theme: "warm" },
      { name: "SigTuple", type: "Indian Startup", initials: "ST", theme: "green" },
      { name: "Cognizant AI", type: "MNC", initials: "CO", theme: "blue" }
    ],
    salaries: [
      { level: "Entry level", amount: "₹8 – 14 LPA", ratio: 32 },
      { level: "Mid level", amount: "₹15 – 25 LPA", ratio: 58 },
      { level: "Senior level", amount: "₹25 – 50 LPA", ratio: 88 },
      { level: "Specialist", amount: "₹50+ LPA", ratio: 100 }
    ],
    futureVerdict: {
      title: "Verdict — Explosive Industry Adoption",
      text: "Visual data makes up over 80% of all internet traffic. As companies automate inspection, security, medical diagnostics, and spatial computing (like Apple Vision Pro), CV experts remain in high demand with outstanding salary multipliers."
    },
    people: [
      {
        avatarInitials: "RK",
        avatarTheme: "sky",
        transformation: "ECE grad → Computer Vision Engineer",
        role: "CV Engineer at SigTuple",
        story: "I got fascinated by camera feeds during college projects. I built a system to check if students wore masks in class. That project helped me clear deep tech interviews without an IIT degree."
      },
      {
        avatarInitials: "SM",
        avatarTheme: "violet",
        transformation: "EE grad → Nvidia Researcher",
        role: "Deep Learning Engineer at Nvidia",
        story: "I spent my college nights learning PyTorch, optimizing models to run on cheap Raspberry Pi boards. Nvidia liked my hands-on hardware-aware AI optimization work."
      }
    ],
    roadmap: [
      { step: "Step 1", name: "Python, NumPy, & Basic OpenCV", meta: "3 weeks • 1 Project", locked: false },
      { step: "Step 2", name: "Image Processing & Math Fundamentals", meta: "4 weeks • 2 Projects", locked: false },
      { step: "Step 3", name: "Deep Learning (PyTorch) & CNNs", meta: "6 weeks • 2 Projects", locked: false },
      { step: "Step 4", name: "Transformers for Vision & Model Deployment", meta: "Locked Step", locked: true }
    ]
  },
  "space-technology": {
    emoji: "🛰️",
    name: "Space Technology",
    tagline: "Write critical software that escapes gravity and operates in orbit.",
    category: "Research",
    badges: {
      safety: "Extremely Safe",
      difficulty: "Advanced",
      isGem: true
    },
    stats: {
      entrySalary: "₹7 – 12 LPA",
      seniorSalary: "₹22 – 45 LPA",
      futureSafety: "96% Safe",
      bestBranch: "ECE / CSE / Aerospace",
      timeToJobReady: "12-15 months"
    },
    description: "SpaceTech isn't just rocket science — it's mostly software. Modern satellites and spacecraft run on embedded real-time operating systems (RTOS) that absolutely cannot crash (there is no restart button in deep space!). You'll learn to write highly optimized, fault-tolerant C/C++ code, analyze satellite telemetry datasets, and develop algorithms for orbital determination and attitude control.",
    projects: [
      { badge: "Beginner", name: "Orbital Mechanics Simulator", description: "Use Python to simulate two-body and three-body orbits, showing how satellites hover in geostationary orbits." },
      { badge: "Intermediate", name: "Satellite Telemetry Parser", description: "Build a binary packet parser in C++ that reads simulated spacecraft sensor streams and alerts on anomalies." },
      { badge: "Advanced", name: "RTOS SmallSat Attitude Controller", description: "Write an RTOS-based program that handles accelerometer inputs and controls thruster jets to stabilize a small satellite." }
    ],
    companies: [
      { name: "ISRO / Dept of Space", type: "Government", initials: "IS", theme: "purple" },
      { name: "Pixxel Space", type: "Indian Startup", initials: "PX", theme: "green" },
      { name: "Skyroot Aerospace", type: "Indian Startup", initials: "SR", theme: "green" },
      { name: "TeamIndus", type: "Global Dream", initials: "TI", theme: "warm" }
    ],
    salaries: [
      { level: "Entry level", amount: "₹7 – 12 LPA", ratio: 28 },
      { level: "Mid level", amount: "₹13 – 22 LPA", ratio: 52 },
      { level: "Senior level", amount: "₹22 – 45 LPA", ratio: 82 },
      { level: "Specialist", amount: "₹45+ LPA", ratio: 100 }
    ],
    futureVerdict: {
      title: "Verdict — Rapidly Privatizing & Expanding",
      text: "With India's new space policy opening up the private sector, startups like Pixxel and Skyroot are attracting massive global funding. High-reliability software engineers who understand hardware constraints are highly sought-after."
    },
    people: [
      {
        avatarInitials: "AD",
        avatarTheme: "cyan",
        transformation: "ECE grad → Flight Software at ISRO",
        role: "Scientist/Engineer at URSC, ISRO",
        story: "I spent my final year building a custom telemetry transceiver for a student Cubesat. Having actual experience dealing with hardware registers and radio packets was why ISRO hired me."
      },
      {
        avatarInitials: "PR",
        avatarTheme: "teal",
        transformation: "CSE grad → Space Startup Lead",
        role: "Flight Software Lead at Pixxel Space",
        story: "I started in standard web dev, but got bored. I took online courses in embedded systems and aerospace math, built a satellite simulator, and pitched myself directly to space startups."
      }
    ],
    roadmap: [
      { step: "Step 1", name: "Bare-Metal C & Register Programming", meta: "5 weeks • 1 Project", locked: false },
      { step: "Step 2", name: "FreeRTOS & Embedded Software Architectures", meta: "6 weeks • 2 Projects", locked: false },
      { step: "Step 3", name: "Orbital Dynamics & Telemetry Engineering", meta: "8 weeks • 2 Projects", locked: false },
      { step: "Step 4", name: "Space-Grade Testing & Flight-Ready Validation", meta: "Locked Step", locked: true }
    ]
  },
  "embedded-systems": {
    emoji: "⚙️",
    name: "Embedded Systems",
    tagline: "Program the tiny brains inside every smart device and automobile on earth.",
    category: "Hardware",
    badges: {
      safety: "High Growth",
      difficulty: "Intermediate",
      isGem: true
    },
    stats: {
      entrySalary: "₹5 – 9 LPA",
      seniorSalary: "₹16 – 32 LPA",
      futureSafety: "91% Safe",
      bestBranch: "ECE / EE / EIE",
      timeToJobReady: "8-10 months"
    },
    description: "Web development gets all the hype, but there are 100 times more microcontrollers on earth than PCs and phones. Embedded systems is about writing software that communicates directly with sensors, motors, and microchips. You will be writing low-level drivers, handling hardware interrupts, and keeping memory usage below a few kilobytes. If you like holding your projects in your hands, embedding code in smart wearables, medical devices, or cars is your path.",
    projects: [
      { badge: "Beginner", name: "UART/I2C Sensor Interface", description: "Write bare-metal C code to read temperature and pressure values from an external sensor using the I2C protocol." },
      { badge: "Intermediate", name: "Bluetooth Smart Wearable", description: "Design a low-power firmware on ESP32 that broadcasts step counts to a mobile app via Bluetooth Low Energy (BLE)." },
      { badge: "Advanced", name: "CAN-Bus Vehicle Dashboard", description: "Simulate a car dashboard that reads RPM, speed, and engine temperature packets from a CAN-Bus automotive network." }
    ],
    companies: [
      { name: "BEL", type: "Government", initials: "BE", theme: "purple" },
      { name: "Ather Energy", type: "Indian Startup", initials: "AE", theme: "green" },
      { name: "Robert Bosch", type: "MNC", initials: "RB", theme: "blue" },
      { name: "Qualcomm India", type: "Global Dream", initials: "QC", theme: "warm" }
    ],
    salaries: [
      { level: "Entry level", amount: "₹5 – 9 LPA", ratio: 27 },
      { level: "Mid level", amount: "₹10 – 16 LPA", ratio: 50 },
      { level: "Senior level", amount: "₹16 – 32 LPA", ratio: 80 },
      { level: "Specialist", amount: "₹32+ LPA", ratio: 100 }
    ],
    futureVerdict: {
      title: "Verdict — Steady, High-Barrier Career",
      text: "The internet of things (IoT) and electric vehicles (EVs) are growing exponentially in India. Because writing memory-efficient C code requires understanding hardware, this field is highly insulated from AI code generation tools."
    },
    people: [
      {
        avatarInitials: "KK",
        avatarTheme: "orange",
        transformation: "EIE grad → Qualcomm Engineer",
        role: "Embedded Software Engineer at Qualcomm",
        story: "Everyone told me to study Java. I ignored them and bought an STM32 board. I wrote drivers from scratch instead of using libraries. That deep understanding got me past the Qualcomm technical test."
      },
      {
        avatarInitials: "RD",
        avatarTheme: "emerald",
        transformation: "EE grad → Ather Firmware lead",
        role: "Senior Firmware Developer at Ather Energy",
        story: "I joined a small solar firm after college. Practiced RTOS and battery management systems on my own. When electric scooters started booming, Ather picked me up immediately."
      }
    ],
    roadmap: [
      { step: "Step 1", name: "C Language Mastery & Bitwise Operations", meta: "3 weeks • 1 Project", locked: false },
      { step: "Step 2", name: "Microcontroller Peripherals (GPIO, ADC, Timers)", meta: "5 weeks • 2 Projects", locked: false },
      { step: "Step 3", name: "Communication Protocols (SPI, I2C, UART)", meta: "5 weeks • 2 Projects", locked: false },
      { step: "Step 4", name: "RTOS Concepts & Memory-Safe Coding", meta: "Locked Step", locked: true }
    ]
  },
  "computational-biology": {
    emoji: "🧬",
    name: "Computational Biology",
    tagline: "Model biological systems, diseases, and drug discovery using massive code simulation.",
    category: "Research",
    badges: {
      safety: "Extremely Safe",
      difficulty: "Advanced",
      isGem: true
    },
    stats: {
      entrySalary: "₹6 – 10 LPA",
      seniorSalary: "₹18 – 35 LPA",
      futureSafety: "97% Safe",
      bestBranch: "CSE / Biotech / Maths",
      timeToJobReady: "12-14 months"
    },
    description: "Computational Biology is about using statistical models and algorithms to simulate life. You will write code to model how biological cells grow, how diseases spread through human organs, or how new chemical structures might work as medicines. If you are deeply interested in mathematics, simulation, and working on solving humanity's biggest health challenges (like cancer or pandemics) using code, this is the path.",
    projects: [
      { badge: "Beginner", name: "Cellular Automata Simulator", description: "Build a Python program that simulates biological cell growth and interaction patterns using rules of Game of Life." },
      { badge: "Intermediate", name: "Epidemiological SIR Model", description: "Model the spread of a virus in a crowded city using differential equations and Python graphing libraries." },
      { badge: "Advanced", name: "Molecular Dynamics Engine", description: "Create a basic 3D simulation showing molecular movements and collisions based on electrostatic forces." }
    ],
    companies: [
      { name: "IISc Lab", type: "Government", initials: "II", theme: "purple" },
      { name: "Ganit Labs", type: "Indian Startup", initials: "GL", theme: "green" },
      { name: "Biocon Research", type: "MNC", initials: "BR", theme: "blue" },
      { name: "Novartis India", type: "Global Dream", initials: "NV", theme: "warm" }
    ],
    salaries: [
      { level: "Entry level", amount: "₹6 – 10 LPA", ratio: 28 },
      { level: "Mid level", amount: "₹11 – 18 LPA", ratio: 51 },
      { level: "Senior level", amount: "₹18 – 35 LPA", ratio: 82 },
      { level: "Specialist", amount: "₹35+ LPA", ratio: 100 }
    ],
    futureVerdict: {
      title: "Verdict — High Academic & R&D Funding",
      text: "As biotech becomes fully digital, pharmaceutical companies rely on high-fidelity computer simulations before running physical lab trials. Specialists in biological modeling can write their own ticket at top-tier research institutes."
    },
    people: [
      {
        avatarInitials: "VJ",
        avatarTheme: "yellow",
        transformation: "Biotech grad → CSIR Researcher",
        role: "Research Scientist at CSIR-IGIB",
        story: "I was unhappy with regular wet-lab work. I spent 8 months learning statistics and Python. Switched to a dry-lab computational research project, and published two papers on genomic patterns."
      },
      {
        avatarInitials: "AR",
        avatarTheme: "sky",
        transformation: "CSE grad → Novartis Lead",
        role: "Principal Computational Modeler at Novartis",
        story: "My math was always strong. I applied machine learning to biological molecules. Companies in drug discovery look for people who are 70% programmers and 30% biology lovers."
      }
    ],
    roadmap: [
      { step: "Step 1", name: "Advanced Statistics & Probability in Python", meta: "4 weeks • 1 Project", locked: false },
      { step: "Step 2", name: "Numerical Methods & Differential Equations", meta: "5 weeks • 2 Projects", locked: false },
      { step: "Step 3", name: "Molecular Dynamics & Structure Modeling", meta: "7 weeks • 2 Projects", locked: false },
      { step: "Step 4", name: "AI/ML Application to Molecular Structures", meta: "Locked Step", locked: true }
    ]
  },
  "cybersecurity": {
    emoji: "🔒",
    name: "Cybersecurity",
    tagline: "Defend systems, hunt vulnerabilities, and outsmart professional cyber adversaries.",
    category: "Security",
    badges: {
      safety: "Highly Insulated",
      difficulty: "Intermediate",
      isGem: false
    },
    stats: {
      entrySalary: "₹5 – 10 LPA",
      seniorSalary: "₹18 – 35 LPA",
      futureSafety: "Critical demand — Growing",
      bestBranch: "CSE / IT / ECE",
      timeToJobReady: "8-10 months"
    },
    description: "Cybersecurity is the front line of defense in the digital world. You will learn to think like a hacker to protect systems. You'll master penetration testing, network defense, threat intelligence, and security operations. From scanning for open ports and database vulnerabilities to analyzing malware signatures, you'll gain the skills needed to guard critical financial and governmental networks against sophisticated attacks.",
    projects: [
      { badge: "Beginner", name: "Vulnerability Network Scanner", description: "Write a script in Python that audits active network hosts and scans for open, insecure ports." },
      { badge: "Intermediate", name: "Network Traffic Analyzer", description: "Capture and analyze network packets using Wireshark and Python Scapy. Identify suspicious traffic patterns and understand how data moves across a network." },
      { badge: "Advanced", name: "Insecure Bank Penetration Lab", description: "Build a mock web banking application, perform SQL injection and XSS exploits, and then patch the security flaws." }
    ],
    companies: [
      { name: "CERT-In", type: "Government", initials: "CE", theme: "purple" },
      { name: "DRDO Cyber division", type: "Government", initials: "DC", theme: "purple" },
      { name: "TAC Security", type: "Indian Startup", initials: "TA", theme: "green" },
      { name: "Wipro CyberDefense", type: "MNC", initials: "WC", theme: "blue" },
      { name: "HCL Security", type: "MNC", initials: "HS", theme: "blue" },
      { name: "Quick Heal", type: "MNC", initials: "QH", theme: "blue" },
      { name: "CrowdStrike India", type: "Global Dream", initials: "CS", theme: "warm" },
      { name: "Palo Alto Networks", type: "Global Dream", initials: "PA", theme: "warm" }
    ],
    salaries: [
      { level: "Entry level", amount: "₹5 – 10 LPA", ratio: 28 },
      { level: "Mid level", amount: "₹11 – 18 LPA", ratio: 51 },
      { level: "Senior level", amount: "₹18 – 35 LPA", ratio: 82 },
      { level: "Specialist", amount: "₹35+ LPA", ratio: 100 }
    ],
    futureVerdict: {
      title: "Verdict — Critical & Everlasting Demand",
      text: "Every piece of software built needs to be secured. While AI can write code, it also creates new code vulnerabilities. Human security auditors who can think creatively and understand compliance regulations are completely irreplaceable."
    },
    people: [
      {
        avatarInitials: "DK",
        avatarTheme: "teal",
        transformation: "IT grad → Security Consultant",
        role: "Lead Penetration Tester at EY India",
        story: "I didn't care about software building, but I loved exploring networks. Spent time on Hack The Box, obtained a CEH certification, and built custom vulnerability scanning projects that got me hired."
      },
      {
        avatarInitials: "RN",
        avatarTheme: "rose",
        transformation: "ECE grad → Incident Handler",
        role: "Cyber Incident Response Specialist at TAC Security",
        story: "I started reading security blogs in college. I built tools to detect phishing emails using NLP. This project got me an interview at TAC, where I now hunt threats daily."
      }
    ],
    roadmap: [
      { step: "Step 1", name: "Linux Administration & Networking Basics", meta: "3 weeks • 1 Project", locked: false },
      { step: "Step 2", name: "Python Scripting for Security Tasks", meta: "4 weeks • 2 Projects", locked: false },
      { step: "Step 3", name: "OWASP Top 10 Web App Security Testing", meta: "6 weeks • 2 Projects", locked: false },
      { step: "Step 4", name: "Active Directory Exploitation & Red Teaming", meta: "Locked Step", locked: true }
    ]
  },
  "web-development": {
    emoji: "🌐",
    name: "Web Development",
    tagline: "Build responsive, lightning-fast web applications that connect millions.",
    category: "Software",
    badges: {
      safety: "Medium Safety",
      difficulty: "Beginner friendly",
      isGem: false
    },
    stats: {
      entrySalary: "₹4 – 8 LPA",
      seniorSalary: "₹15 – 28 LPA",
      futureSafety: "80% Safe",
      bestBranch: "Open to all branches",
      timeToJobReady: "6-8 months"
    },
    description: "Web development is the most accessible gateway into software engineering. You'll master HTML, CSS, JavaScript, and modern web frameworks like React and Next.js, alongside backend platforms. You'll learn to structure databases, design RESTful APIs, and construct highly responsive interfaces that render smoothly on any device. It's the absolute best choice if you want to turn your ideas into functional products that anyone can access via a browser link.",
    projects: [
      { badge: "Beginner", name: "Responsive Portfolio Hub", description: "Design a clean, responsive personal portfolio website with a custom contact form using CSS Grid and JS." },
      { badge: "Intermediate", name: "Real-time Collaboration Board", description: "Build a real-time collaborative whiteboard using Node.js, Express, and WebSockets for simultaneous drawing." },
      { badge: "Advanced", name: "Full-Stack SaaS Marketplace", description: "Develop a full-featured SaaS platform with Stripe payments, user authentication, and Postgres DB." }
    ],
    companies: [
      { name: "NIC", type: "Government", initials: "NI", theme: "purple" },
      { name: "Razorpay", type: "Indian Startup", initials: "RP", theme: "green" },
      { name: "Google India", type: "Global Dream", initials: "GG", theme: "warm" },
      { name: "Wipro", type: "MNC", initials: "WP", theme: "blue" }
    ],
    salaries: [
      { level: "Entry level", amount: "₹4 – 8 LPA", ratio: 24 },
      { level: "Mid level", amount: "₹9 – 15 LPA", ratio: 48 },
      { level: "Senior level", amount: "₹15 – 28 LPA", ratio: 78 },
      { level: "Specialist", amount: "₹28+ LPA", ratio: 100 }
    ],
    futureVerdict: {
      title: "Verdict — High Competition, Evergreen Base",
      text: "AI models can write standard landing pages easily. However, building complex, stateful web applications, optimizing performance, and integrating APIs still requires solid engineering knowledge, keeping skilled frontend and full-stack developers in demand."
    },
    people: [
      {
        avatarInitials: "MK",
        avatarTheme: "blue",
        transformation: "Civil grad → UI Developer",
        role: "Frontend Engineer at Razorpay",
        story: "I had no coding classes in college. I built three dynamic clones of popular sites like Trello and Spotify, hosted them online, and put the links on my resume. Practical projects got me the job."
      },
      {
        avatarInitials: "TD",
        avatarTheme: "emerald",
        transformation: "CSE grad → SaaS Builder",
        role: "Founder at Typeform-clone Startup",
        story: "Learned Web Dev in my second year. Instead of applying for jobs, I built a micro-SaaS for form generation. Sold the project for $12k after graduation and joined a startup as a senior engineer."
      }
    ],
    roadmap: [
      { step: "Step 1", name: "HTML5, CSS3, & Modern JavaScript (ES6+)", meta: "3 weeks • 1 Project", locked: false },
      { step: "Step 2", name: "React.js & State Management (Redux/Zustand)", meta: "4 weeks • 2 Projects", locked: false },
      { step: "Step 3", name: "Node.js, Express, & SQL/NoSQL Databases", meta: "5 weeks • 2 Projects", locked: false },
      { step: "Step 4", name: "Next.js App Router, SSR, & Production Vercel Deploy", meta: "Locked Step", locked: true }
    ]
  },
  "ai-machine-learning": {
    emoji: "🧠",
    name: "AI / Machine Learning",
    tagline: "Train intelligence models that predict, generate, and automate at global scale.",
    category: "AI & Data",
    badges: {
      safety: "Extremely Safe",
      difficulty: "Advanced",
      isGem: false
    },
    stats: {
      entrySalary: "₹10 – 18 LPA",
      seniorSalary: "₹30 – 60 LPA",
      futureSafety: "99% Safe",
      bestBranch: "CSE / IT / Maths & Computing",
      timeToJobReady: "10-12 months"
    },
    description: "Artificial Intelligence isn't just about calling OpenAI's endpoints. It's about understanding the underlying mathematics — linear algebra, calculus, and statistics — and implementing models that find patterns in huge datasets. You will write code to clean messy data, define network architectures in PyTorch or TensorFlow, train models on GPU clusters, and evaluate predictions to minimize errors.",
    projects: [
      { badge: "Beginner", name: "House Price Predictor", description: "Use pandas and scikit-learn to build a regression model that predicts house prices based on geographic variables." },
      { badge: "Intermediate", name: "E-Commerce Recommendation Engine", description: "Construct a collaborative filtering system that recommends items to users using their historic clicks." },
      { badge: "Advanced", name: "Custom Fine-tuned LLM chatbot", description: "Fine-tune a Llama-3 model on a custom medical dataset using QLoRA and evaluate the generation results." }
    ],
    companies: [
      { name: "C-DAC", type: "Government", initials: "CD", theme: "purple" },
      { name: "Krutrim AI", type: "Indian Startup", initials: "KR", theme: "green" },
      { name: "Microsoft Research", type: "Global Dream", initials: "MS", theme: "warm" },
      { name: "Infosys AI", type: "MNC", initials: "IN", theme: "blue" }
    ],
    salaries: [
      { level: "Entry level", amount: "₹10 – 18 LPA", ratio: 35 },
      { level: "Mid level", amount: "₹19 – 30 LPA", ratio: 60 },
      { level: "Senior level", amount: "₹30 – 60 LPA", ratio: 90 },
      { level: "Specialist", amount: "₹60+ LPA", ratio: 100 }
    ],
    futureVerdict: {
      title: "Verdict — Leading the Tech Frontier",
      text: "Machine Learning is currently driving the largest investment wave in software history. Companies across the world are racing to deploy local intelligence models, making ML/AI engineers the most highly sought-after candidates in the market."
    },
    people: [
      {
        avatarInitials: "YJ",
        avatarTheme: "purple",
        transformation: "Maths grad → AI Scientist",
        role: "Applied Scientist at Microsoft Research",
        story: "I double-downed on statistics. Instead of just coding, I wrote blog posts breaking down machine learning math. A recruiter saw my explainer on Transformers and offered an interview."
      },
      {
        avatarInitials: "AL",
        avatarTheme: "amber",
        transformation: "CSE grad → ML Engineer",
        role: "Senior ML Engineer at Krutrim AI",
        story: "I trained smaller models on my local RTX card for Kaggle contests. Winning a top tier contest opened doors to interview at India's leading AI labs directly."
      }
    ],
    roadmap: [
      { step: "Step 1", name: "Linear Algebra & Calculus for ML", meta: "4 weeks • 1 Project", locked: false },
      { step: "Step 2", name: "Data Wrangling (Pandas, NumPy, Scikit-Learn)", meta: "4 weeks • 2 Projects", locked: false },
      { step: "Step 3", name: "Deep Learning Foundations (PyTorch, Neurons)", meta: "6 weeks • 2 Projects", locked: false },
      { step: "Step 4", name: "LLMs, Transformers, & Quantization Techniques", meta: "Locked Step", locked: true }
    ]
  },
  "mobile-development": {
    emoji: "📱",
    name: "Mobile Development",
    tagline: "Ship slick, interactive application packages that live in billions of pockets.",
    category: "Software",
    badges: {
      safety: "High Growth",
      difficulty: "Beginner friendly",
      isGem: false
    },
    stats: {
      entrySalary: "₹5 – 9 LPA",
      seniorSalary: "₹18 – 32 LPA",
      futureSafety: "88% Safe",
      bestBranch: "Open to all branches",
      timeToJobReady: "6-8 months"
    },
    description: "Over 90% of internet users browse primarily on their mobile phones. Mobile developers build native (Swift, Kotlin) or cross-platform (Flutter, React Native) applications that handle offline storage, push notifications, camera permissions, and rich touch gestures. You will learn to optimize layouts for different screen aspect ratios, handle memory leaks, and deploy apps to the Google Play Store and Apple App Store.",
    projects: [
      { badge: "Beginner", name: "Offline Habit Tracker", description: "Create an offline-first habit tracker app with SQLite storage and push reminders using Flutter." },
      { badge: "Intermediate", name: "Social Media Feed App", description: "Build a mobile feed with image uploading, caching, infinite scrolling, and Firebase database backend." },
      { badge: "Advanced", name: "Real-time Chat with Audio", description: "Develop an instant messaging app using Kotlin/Swift with real-time sockets and audio recording features." }
    ],
    companies: [
      { name: "IRCTC Mobile", type: "Government", initials: "IR", theme: "purple" },
      { name: "Swiggy", type: "Indian Startup", initials: "SW", theme: "green" },
      { name: "Uber India", type: "Global Dream", initials: "UB", theme: "warm" },
      { name: "Tata Elxsi", type: "MNC", initials: "TE", theme: "blue" }
    ],
    salaries: [
      { level: "Entry level", amount: "₹5 – 9 LPA", ratio: 28 },
      { level: "Mid level", amount: "₹10 – 18 LPA", ratio: 52 },
      { level: "Senior level", amount: "₹18 – 32 LPA", ratio: 82 },
      { level: "Specialist", amount: "₹32+ LPA", ratio: 100 }
    ],
    futureVerdict: {
      title: "Verdict — Stable App Economy",
      text: "Businesses are transitioning to custom mobile applications for higher customer retention. A good mobile app requires smooth animations and highly customized gesture controls, making skilled app developers a highly valuable asset."
    },
    people: [
      {
        avatarInitials: "SK",
        avatarTheme: "sky",
        transformation: "ECE grad → Flutter Developer",
        role: "Mobile Engineer at Swiggy",
        story: "I liked seeing my code run on my own phone screen. I built two Android utility apps and published them on Play Store. Having actual store links on my resume made job interviews a breeze."
      },
      {
        avatarInitials: "JD",
        avatarTheme: "indigo",
        transformation: "CSE grad → iOS Specialist",
        role: "iOS Engineer at Uber India",
        story: "I saved up money to buy a used Mac and learned Swift. Since iOS developers are relatively rare in India compared to Android, I was able to secure premium consulting contracts."
      }
    ],
    roadmap: [
      { step: "Step 1", name: "Dart Programming & Flutter Framework basics", meta: "3 weeks • 1 Project", locked: false },
      { step: "Step 2", name: "State Management (Provider/Bloc/Riverpod)", meta: "4 weeks • 2 Projects", locked: false },
      { step: "Step 3", name: "Native APIs Integration (Camera, GPS, Storage)", meta: "5 weeks • 2 Projects", locked: false },
      { step: "Step 4", name: "App Performance Tuning & Store Deployment", meta: "Locked Step", locked: true }
    ]
  },
  "cloud-devops": {
    emoji: "☁️",
    name: "Cloud & DevOps",
    tagline: "Keep the internet running — scale, automate, and deploy systems fearlessly.",
    category: "Software",
    badges: {
      safety: "Highly Insulated",
      difficulty: "Intermediate",
      isGem: false
    },
    stats: {
      entrySalary: "₹6 – 10 LPA",
      seniorSalary: "₹20 – 40 LPA",
      futureSafety: "94% Safe",
      bestBranch: "CSE / IT / ECE",
      timeToJobReady: "8-10 months"
    },
    description: "DevOps and Cloud Engineering is about orchestrating infrastructure. You'll learn to handle servers, set up automated deployment pipelines (CI/CD), manage Docker containers, and provision cloud resources using Terraform. If you enjoy solving problems like 'how do we handle 1 million users visiting our website at the exact same second?' and like scripting automation, this is the perfect career path.",
    projects: [
      { badge: "Beginner", name: "Auto-Deploy Static Website", description: "Set up a Github Actions CI/CD workflow that deploys a frontend site to AWS S3 bucket automatically on every push." },
      { badge: "Intermediate", name: "Multi-Container Docker App", description: "Dockerize a Node.js and Redis application, set up networking, and deploy them on a local Kubernetes cluster." },
      { badge: "Advanced", name: "Terraform AWS Architecture", description: "Write Terraform code to automatically launch a load balancer and auto-scaling EC2 instances inside a secure custom VPC." }
    ],
    companies: [
      { name: "NIC Cloud", type: "Government", initials: "NI", theme: "purple" },
      { name: "Postman", type: "Indian Startup", initials: "PM", theme: "green" },
      { name: "Amazon AWS", type: "Global Dream", initials: "AW", theme: "warm" },
      { name: "Accenture", type: "MNC", initials: "AC", theme: "blue" }
    ],
    salaries: [
      { level: "Entry level", amount: "₹6 – 10 LPA", ratio: 29 },
      { level: "Mid level", amount: "₹11 – 20 LPA", ratio: 54 },
      { level: "Senior level", amount: "₹20 – 40 LPA", ratio: 85 },
      { level: "Specialist", amount: "₹40+ LPA", ratio: 100 }
    ],
    futureVerdict: {
      title: "Verdict — High Paying Infrastructure Backbone",
      text: "Every tech startup needs cloud management. Because database crashes and server down-times lead to direct business losses, companies are willing to pay top dollar for engineers who can guarantee system reliability and speed."
    },
    people: [
      {
        avatarInitials: "VM",
        avatarTheme: "pink",
        transformation: "EE grad → Platform Engineer",
        role: "DevOps Engineer at Postman",
        story: "I loved Linux and scripting shell commands. I studied AWS certification syllabus, built an automated server monitor, and posted my architecture charts on LinkedIn. Postman team saw my posts."
      },
      {
        avatarInitials: "SR",
        avatarTheme: "amber",
        transformation: "CSE grad → AWS Consultant",
        role: "Cloud Solutions Architect at AWS India",
        story: "I spent my college years managing my department's local laboratory servers. Troubleshooting real routing issues gave me practical knowledge that standard textbooks never teach."
      }
    ],
    roadmap: [
      { step: "Step 1", name: "Linux Bash Scripting & Git Workflow", meta: "3 weeks • 1 Project", locked: false },
      { step: "Step 2", name: "Docker Containerization & Registry Control", meta: "4 weeks • 2 Projects", locked: false },
      { step: "Step 3", name: "CI/CD Pipelines & Jenkins/GitHub Actions", meta: "5 weeks • 2 Projects", locked: false },
      { step: "Step 4", name: "Kubernetes Cluster Scaling & Terraform Infrastructure", meta: "Locked Step", locked: true }
    ]
  },
  "data-science": {
    emoji: "📊",
    name: "Data Science",
    tagline: "Analyze datasets to extract decisions that shape entire corporate directions.",
    category: "AI & Data",
    badges: {
      safety: "Medium Safety",
      difficulty: "Intermediate",
      isGem: false
    },
    stats: {
      entrySalary: "₹6 – 9 LPA",
      seniorSalary: "₹18 – 35 LPA",
      futureSafety: "86% Safe",
      bestBranch: "CSE / IT / ECE / EEE",
      timeToJobReady: "8-10 months"
    },
    description: "Data Science is the art of translating raw numbers into actionable business strategy. You will master data extraction (SQL), clean noisy variables in Pandas, and build interactive dashboards to communicate your insights. You'll also learn the foundations of statistical tests, enabling you to prove whether a new app feature actually increased user engagement or if it was just a random fluke.",
    projects: [
      { badge: "Beginner", name: "SQL Sales Audit Database", description: "Write complex SQL queries to calculate monthly sales trends, inventory turnover, and top purchasing customer cohorts." },
      { badge: "Intermediate", name: "Customer Churn Dashboard", description: "Analyze user logs in Python, predict churn risk, and display metrics on a dynamic Streamlit dashboard." },
      { badge: "Advanced", name: "A/B Testing Sign-up Funnel", description: "Evaluate click telemetry using hypothesis testing (t-test) in Python to see if a redesigned page boosts signup rates." }
    ],
    companies: [
      { name: "UIDAI", type: "Government", initials: "UI", theme: "purple" },
      { name: "Fractal Analytics", type: "MNC", initials: "FA", theme: "blue" },
      { name: "Ola Cabs", type: "Indian Startup", initials: "OL", theme: "green" },
      { name: "Meta India", type: "Global Dream", initials: "ME", theme: "warm" }
    ],
    salaries: [
      { level: "Entry level", amount: "₹6 – 9 LPA", ratio: 28 },
      { level: "Mid level", amount: "₹10 – 18 LPA", ratio: 51 },
      { level: "Senior level", amount: "₹18 – 35 LPA", ratio: 82 },
      { level: "Specialist", amount: "₹35+ LPA", ratio: 100 }
    ],
    futureVerdict: {
      title: "Verdict — Strong Demand with Focus on Value",
      text: "While simple data cleaning can be automated, understanding *why* metrics behave the way they do and communicating that to business leaders is a uniquely human skill. Data Scientists who can bridge code and business strategy remain highly valued."
    },
    people: [
      {
        avatarInitials: "NK",
        avatarTheme: "emerald",
        transformation: "Mechanical grad → Data Analyst",
        role: "Senior Data Scientist at Ola",
        story: "I learned SQL and Excel first. Secured a basic analyst role, then learned Python and modeling. Built ride-pricing calculators on my own, which helped me transfer to the core data team."
      },
      {
        avatarInitials: "PM",
        avatarTheme: "violet",
        transformation: "CSE grad → Analytics Lead",
        role: "Data Analytics Consultant at Fractal",
        story: "I loved presenting data. Instead of just modeling, I practiced data visualization with Tableau. My ability to present complex calculations simply is what set me apart from other candidates."
      }
    ],
    roadmap: [
      { step: "Step 1", name: "SQL Queries, Joins, & Database Aggregations", meta: "3 weeks • 1 Project", locked: false },
      { step: "Step 2", name: "Python Data Analysis (Pandas, Seaborn, Matplotlib)", meta: "4 weeks • 2 Projects", locked: false },
      { step: "Step 3", name: "Hypothesis Testing & Statistical Inference", meta: "4 weeks • 2 Projects", locked: false },
      { step: "Step 4", name: "Machine Learning Models & Streamlit Dashboard Dev", meta: "Locked Step", locked: true }
    ]
  }
};
