import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import { connectToDB } from "@/db/connection";
import Candidate from "@/db/models/_candidate.model";
import JobPosting from "@/db/models/_job.model";

// Function to generate random candidate data
const generateCandidateData = (count: number) => {
  const candidates = [];
  const batches = ["2020", "2021", "2022", "2023", "2024"];
  const branches = [
    "CSE",
    "IT",
    "ECE",
    "EEE",
    "Mechanical",
    "Civil",
    "Chemical",
    "Biotechnology",
    "Aerospace",
    "Automobile",
  ];
  const colleges = [
    "MIT",
    "Stanford",
    "Harvard",
    "IIT Delhi",
    "IIT Bombay",
    "IIT Kanpur",
    "IIT Kharagpur",
    "IIT Madras",
    "NIT Trichy",
  ];

  const skillsArr = [
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "C#",
    "Ruby",
    "PHP",
    "Go",
    "Swift",
    "Kotlin",
    "React",
    "Angular",
    "Vue.js",
    "Node.js",
    "Django",
    "Flask",
    "Spring Boot",
    "Express.js",
  ];

  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({
      firstName,
      lastName,
      provider: "example.com",
    });

    const skillCount = faker.number.int({ min: 3, max: 8 });
    const skills = faker.helpers.arrayElements(skillsArr, skillCount);

    candidates.push({
      name: `${firstName} ${lastName}`,
      email,
      skills: [...new Set(skills)], // Remove duplicates
      batch: faker.helpers.arrayElement(batches),
      branch: faker.helpers.arrayElement(branches),
      college: faker.helpers.arrayElement(colleges),
      github: `https://github.com/${faker.internet.username({
        firstName,
        lastName,
      })}`,
      linkedin: `https://linkedin.com/in/${faker.internet.username({
        firstName,
        lastName,
      })}`,
      resume: `https://resume.example.com/${faker.string.uuid()}.pdf`,
      description: faker.person.bio(),
    });
  }

  return candidates;
};

// Seeder function
export const seedCandidates = async () => {
  try {
    await connectToDB();

    // Clear existing data
    await Candidate.deleteMany({});
    console.log("Cleared existing candidates");

    // Generate new data
    const candidateCount = 50;
    const candidates = generateCandidateData(candidateCount);

    // Insert new data
    await Candidate.insertMany(candidates);
    console.log(`Successfully seeded ${candidateCount} candidates`);

    // Disconnect
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding candidates:", error);
    process.exit(1);
  }
};

const createdBy = "6859784bb3c735d39efec07e";

const organizationTypes = ["Private", "Public", "Startup", "Non-Profit"];
const industryTypes = ["IT", "Healthcare", "Finance", "Education"];
const teamSizes = ["1-10", "11-50", "51-200", "200+"];
const socialPlatforms = ["Facebook", "Twitter", "LinkedIn", "Instagram"];

const generateData = () => {
  const socialLinks = Array.from(
    { length: faker.number.int({ min: 1, max: 4 }) },
    () => ({
      platform: faker.helpers.arrayElement(socialPlatforms),
      url: faker.internet.url(),
    })
  );

  return {
    companyName: faker.company.name(),
    companyLogo: faker.image.url(),
    bannerImage: faker.image.url(),
    aboutUs: faker.lorem.paragraph(),

    organizationType: faker.helpers.arrayElement(organizationTypes),
    industryTypes: faker.helpers.arrayElements(industryTypes, {
      min: 1,
      max: 3,
    }),
    teamSize: faker.helpers.arrayElement(teamSizes),
    yearOfEstablishment: faker.date.past({ years: 10 }),
    companyWebsite: faker.internet.url(),
    companyVision: faker.lorem.sentence(),

    socialMediaProfiles: socialLinks,

    mapLocation: faker.location.streetAddress(),
    phone: faker.phone.number(),
    email: faker.internet.email(),

    createdBy,
  };
};

export async function seedCompanies() {
  await connectToDB();

  await JobPosting.deleteMany(); // optional: wipe before seeding

  const postings = Array.from({ length: 15 }, generateData);

  await JobPosting.insertMany(postings);
  console.log("Seeded 15 job postings ✅");

  mongoose.disconnect();
}
