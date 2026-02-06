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

// Component registrations for TamboProvider
export const tamboComponents = [
  {
    name: "PlanetInfo",
    component: PlanetInfo,
    description: "Displays detailed information about a Star Wars planet including climate, population, terrain, and description.",
    propsSchema: z.object({
      name: z.string().describe("The name of the planet"),
      climate: z.string().describe("The climate of the planet (e.g., temperate, arid, frozen)"),
      population: z.string().describe("The population of the planet"),
      terrain: z.string().describe("The terrain of the planet (e.g., mountains, forests, deserts)"),
      description: z.string().describe("A brief description of the planet or its significance"),
    }),
  },
  {
    name: "StarshipFleet",
    component: StarshipFleet,
    description: "Displays a list of starships in a fleet with their current status, shield levels, and power readings.",
    propsSchema: z.object({
      fleetName: z.string().describe("The name of the fleet (e.g., Red Squadron, Death Star Defense Fleet)"),
      ships: z.array(z.object({
        id: z.string().describe("Unique identifier for the ship"),
        name: z.string().describe("Name of the starship"),
        model: z.string().describe("Model/class of the starship"),
        shields: z.number().min(0).max(100).describe("Shield strength percentage (0-100)"),
        power: z.number().min(0).max(100).describe("Power level percentage (0-100)"),
        status: z.enum(["active", "repair", "combat"]).describe("Current operational status"),
      })).describe("List of ships in the fleet"),
    }),
  },
  {
    name: "Holocron",
    component: Holocron,
    description: "Displays wisdom, quotes, or messages from Jedi/Sith masters with a glowing holographic effect.",
    propsSchema: z.object({
      message: z.string().describe("The quote or message to display"),
      speaker: z.string().describe("The name of the speaker (e.g., Yoda, Obi-Wan Kenobi, Darth Vader)"),
    }),
  },
  {
    name: "MissionLog",
    component: MissionLog,
    description: "Displays active mission objectives and their completion status with priority indicators.",
    propsSchema: z.object({
      missions: z.array(z.object({
        id: z.string().describe("Unique identifier for the mission"),
        title: z.string().describe("Title/description of the mission objective"),
        status: z.enum(["completed", "in-progress", "pending"]).describe("Current status of the mission"),
        priority: z.enum(["low", "medium", "high"]).describe("Priority level of the mission"),
      })).describe("List of mission objectives"),
    }),
  },
  {
    name: "GalacticMap",
    component: GalacticMap,
    description: "Displays a visual star map showing planets as nodes and hyperspace routes connecting them.",
    propsSchema: z.object({
      planets: z.array(z.object({
        id: z.string().describe("Unique identifier for the planet"),
        name: z.string().describe("Name of the planet"),
        x: z.number().min(0).max(100).describe("X position on the map (0-100 percentage)"),
        y: z.number().min(0).max(100).describe("Y position on the map (0-100 percentage)"),
        type: z.string().describe("Type of planet (e.g., Core World, Mid Rim, Outer Rim)"),
        description: z.string().describe("Brief description of the planet"),
      })).describe("List of planets to display on the map"),
      routes: z.array(z.object({
        from: z.string().describe("ID of the origin planet"),
        to: z.string().describe("ID of the destination planet"),
      })).describe("List of hyperspace routes connecting planets"),
    }),
  },
  {
    name: "CrewRoster",
    component: CrewRoster,
    description: "Displays a grid of crew member profile cards with expandable details.",
    propsSchema: z.object({
      crew: z.array(z.object({
        id: z.string().describe("Unique identifier for the crew member"),
        name: z.string().describe("Full name of the crew member"),
        role: z.string().describe("Role/position (e.g., Pilot, Engineer, Commander)"),
        species: z.string().describe("Species of the crew member (e.g., Human, Wookiee, Twi'lek)"),
        affiliation: z.string().describe("Faction affiliation (e.g., Rebel Alliance, Galactic Empire)"),
        details: z.string().describe("Additional details or background information"),
      })).describe("List of crew members"),
    }),
  },
  {
    name: "BattleStatus",
    component: BattleStatus,
    description: "Displays a real-time combat dashboard with force counts, threat level, and power distribution.",
    propsSchema: z.object({
      alliedForces: z.number().min(0).describe("Number of allied forces/ships"),
      enemyForces: z.number().min(0).describe("Number of enemy forces/ships"),
      threatLevel: z.enum(["low", "medium", "high", "critical"]).describe("Current threat assessment level"),
      shieldPower: z.number().min(0).max(100).describe("Shield power percentage (0-100)"),
      weaponPower: z.number().min(0).max(100).describe("Weapon power percentage (0-100)"),
      engagementName: z.string().describe("Name of the current engagement/battle"),
    }),
  },
  {
    name: "HyperdriveCalculator",
    component: HyperdriveCalculator,
    description: "A travel time calculator for hyperspace route planning with known routes database.",
    propsSchema: z.object({
      knownRoutes: z.array(z.object({
        origin: z.string().describe("Name of the origin planet"),
        destination: z.string().describe("Name of the destination planet"),
        distance: z.number().min(0).describe("Distance in parsecs"),
        estimatedTime: z.string().describe("Estimated travel time (e.g., '12 hours', '2 days')"),
      })).describe("List of known hyperspace routes with travel times"),
    }),
  },
];
