"use client";

import { z } from "zod";
import { PlanetInfo } from "@/components/PlanetInfo";
import { StarshipFleet } from "@/components/StarshipFleet";
import { Holocron } from "@/components/Holocron";
import { MissionLog } from "@/components/MissionLog";
import { GalacticMap } from "@/components/GalacticMap";
import { CrewRoster } from "@/components/CrewRoster";
import { BattleStatus } from "@/components/BattleStatus";
import { HyperdriveCalculator } from "@/components/HyperdriveCalculator";
import { StyledContent } from "@/components/StyledContent";
import { DataCard } from "@/components/DataCard";

// Component registrations for TamboProvider
// All string fields use .default("") to prevent "expected string, received undefined" errors
// when the AI omits a field during streaming or partial generation.
export const tamboComponents = [
  {
    name: "StyledContent",
    component: StyledContent,
    description: "Renders beautifully styled text content with customizable colors, sizes, and display styles. Use this for ANY request involving styled text, colored text, headings, titles, quotes, highlighted text, banners, or general content display. This is the default component for text styling requests like 'show me blue text', 'create a red heading', 'make a quote', etc.",
    propsSchema: z.object({
      title: z.string().default("").describe("The main title or heading text to display"),
      content: z.string().default("").describe("The body content or description text"),
      color: z.string().default("blue").describe("The accent color name (blue, red, green, yellow, purple, cyan, orange, pink, white, gold) or any CSS color value"),
      size: z.string().default("medium").describe("The size of the text display: small, medium, or large"),
      style: z.string().default("heading").describe("The visual style: heading (centered title), paragraph (body text), quote (blockquote style), highlight (emphasized box), banner (top-accented display)"),
    }),
  },
  {
    name: "DataCard",
    component: DataCard,
    description: "Displays structured data in a card format with labeled key-value pairs. Use for showing information, stats, facts, comparisons, or any structured data that has labels and values.",
    propsSchema: z.object({
      title: z.string().default("").describe("The card title"),
      description: z.string().default("").describe("A brief description or subtitle"),
      items: z.array(z.object({
        label: z.string().default("").describe("The label/key for this data point"),
        value: z.string().default("").describe("The value for this data point"),
      })).default([]).describe("Array of label-value data pairs to display"),
      accentColor: z.string().default("blue").describe("The accent color name (blue, red, green, yellow, purple, cyan, orange, pink, white, gold)"),
    }),
  },
  {
    name: "PlanetInfo",
    component: PlanetInfo,
    description: "Displays detailed information about a Star Wars planet including climate, population, terrain, and description.",
    propsSchema: z.object({
      name: z.string().default("").describe("The name of the planet"),
      climate: z.string().default("").describe("The climate of the planet (e.g., temperate, arid, frozen)"),
      population: z.string().default("").describe("The population of the planet"),
      terrain: z.string().default("").describe("The terrain of the planet (e.g., mountains, forests, deserts)"),
      description: z.string().default("").describe("A brief description of the planet or its significance"),
    }),
  },
  {
    name: "StarshipFleet",
    component: StarshipFleet,
    description: "Displays a list of starships in a fleet with their current status, shield levels, and power readings.",
    propsSchema: z.object({
      fleetName: z.string().default("").describe("The name of the fleet (e.g., Red Squadron, Death Star Defense Fleet)"),
      ships: z.array(z.object({
        id: z.string().default("").describe("Unique identifier for the ship"),
        name: z.string().default("").describe("Name of the starship"),
        model: z.string().default("").describe("Model/class of the starship"),
        shields: z.number().min(0).max(100).default(0).describe("Shield strength percentage (0-100)"),
        power: z.number().min(0).max(100).default(0).describe("Power level percentage (0-100)"),
        status: z.string().default("active").describe("Current operational status: active, repair, or combat"),
      })).default([]).describe("List of ships in the fleet"),
    }),
  },
  {
    name: "Holocron",
    component: Holocron,
    description: "Displays wisdom, quotes, or messages from Jedi/Sith masters with a glowing holographic effect.",
    propsSchema: z.object({
      message: z.string().default("").describe("The quote or message to display"),
      speaker: z.string().default("").describe("The name of the speaker (e.g., Yoda, Obi-Wan Kenobi, Darth Vader)"),
    }),
  },
  {
    name: "MissionLog",
    component: MissionLog,
    description: "Displays active mission objectives and their completion status with priority indicators.",
    propsSchema: z.object({
      missions: z.array(z.object({
        id: z.string().default("").describe("Unique identifier for the mission"),
        title: z.string().default("").describe("Title/description of the mission objective"),
        status: z.string().default("pending").describe("Current status: completed, in-progress, or pending"),
        priority: z.string().default("medium").describe("Priority level: low, medium, or high"),
      })).default([]).describe("List of mission objectives"),
    }),
  },
  {
    name: "GalacticMap",
    component: GalacticMap,
    description: "Displays a visual star map showing planets as nodes and hyperspace routes connecting them.",
    propsSchema: z.object({
      planets: z.array(z.object({
        id: z.string().default("").describe("Unique identifier for the planet"),
        name: z.string().default("").describe("Name of the planet"),
        x: z.number().min(0).max(100).default(50).describe("X position on the map (0-100 percentage)"),
        y: z.number().min(0).max(100).default(50).describe("Y position on the map (0-100 percentage)"),
        type: z.string().default("").describe("Type of planet (e.g., Core World, Mid Rim, Outer Rim)"),
        description: z.string().default("").describe("Brief description of the planet"),
      })).default([]).describe("List of planets to display on the map"),
      routes: z.array(z.object({
        from: z.string().default("").describe("ID of the origin planet"),
        to: z.string().default("").describe("ID of the destination planet"),
      })).default([]).describe("List of hyperspace routes connecting planets"),
    }),
  },
  {
    name: "CrewRoster",
    component: CrewRoster,
    description: "Displays a grid of crew member profile cards with expandable details.",
    propsSchema: z.object({
      crew: z.array(z.object({
        id: z.string().default("").describe("Unique identifier for the crew member"),
        name: z.string().default("").describe("Full name of the crew member"),
        role: z.string().default("").describe("Role/position (e.g., Pilot, Engineer, Commander)"),
        species: z.string().default("").describe("Species of the crew member (e.g., Human, Wookiee, Twi'lek)"),
        affiliation: z.string().default("").describe("Faction affiliation (e.g., Rebel Alliance, Galactic Empire)"),
        details: z.string().default("").describe("Additional details or background information"),
      })).default([]).describe("List of crew members"),
    }),
  },
  {
    name: "BattleStatus",
    component: BattleStatus,
    description: "Displays a real-time combat dashboard with force counts, threat level, and power distribution.",
    propsSchema: z.object({
      alliedForces: z.number().min(0).default(0).describe("Number of allied forces/ships"),
      enemyForces: z.number().min(0).default(0).describe("Number of enemy forces/ships"),
      threatLevel: z.string().default("low").describe("Current threat assessment: low, medium, high, or critical"),
      shieldPower: z.number().min(0).max(100).default(0).describe("Shield power percentage (0-100)"),
      weaponPower: z.number().min(0).max(100).default(0).describe("Weapon power percentage (0-100)"),
      engagementName: z.string().default("").describe("Name of the current engagement/battle"),
    }),
  },
  {
    name: "HyperdriveCalculator",
    component: HyperdriveCalculator,
    description: "A travel time calculator for hyperspace route planning with known routes database.",
    propsSchema: z.object({
      knownRoutes: z.array(z.object({
        origin: z.string().default("").describe("Name of the origin planet"),
        destination: z.string().default("").describe("Name of the destination planet"),
        distance: z.number().min(0).default(0).describe("Distance in parsecs"),
        estimatedTime: z.string().default("").describe("Estimated travel time (e.g., '12 hours', '2 days')"),
      })).default([]).describe("List of known hyperspace routes with travel times"),
    }),
  },
];
