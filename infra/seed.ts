import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase_client';
import type { Household } from '../types/household';
import type { HouseholdUser } from '../types/household_user';
import type { Task } from '../types/task';
import type { TaskCompletion } from '../types/task_completion';

type SeedTask = Omit<Task, 'id'> & { id: string };
type SeedHousehold = Household & { id: string; tasks: SeedTask[] };

const createCompletion = (completion: TaskCompletion) => ({
  household_member_id: completion.household_member_id,
  execution_date: Timestamp.fromDate(completion.execution_date),
});

const members: Record<string, HouseholdUser> = {
  sara: {
    id: 'X4cti0gayZa6hbzNVHENnIdRZB23',
    nickname: 'Sara',
    role: 'admin',
    icon: 'fox',
    status: 'active',
  },
  leo: {
    id: 'lGMrpaWAPFd3HBr4Dgko6Zoc85t1',
    nickname: 'Leo',
    role: 'member',
    icon: 'owl',
    status: 'active',
  },
  maja: {
    id: 'UNlIq9jzsoMX80xYlo2kdUylnCg2',
    nickname: 'Maja',
    role: 'member',
    icon: 'octopus',
    status: 'active',
  },
  noah: {
    id: 'eIEOcLsItWYSuM8jRwiHEf6BM5k1',
    nickname: 'Noah',
    role: 'admin',
    icon: 'frog',
    status: 'active',
  },
  linn: {
    id: 'G6zrNedgOCgyWRO2gYhbe6Vb2Rg1',
    nickname: 'Linn',
    role: 'member',
    icon: 'unicorn',
    status: 'active',
  },
};

const seedHouseholds: SeedHousehold[] = [
  {
    id: 'seed-household-lugnagrand',
    created_by: members.sara.id,
    name: 'Lugnagränd 5',
    invitation_code: 'LUGNA-5',
    users: [
      members.sara,
      members.leo,
      {
        ...members.maja,
        role: 'member',
        icon: 'dolphin',
      },
    ],
    tasks: [
      {
        id: 'seed-task-kitchen-reset',
        created_by: members.sara.id,
        household_id: 'seed-household-lugnagrand',
        title: 'Storstädning av köket',
        description:
          'Plocka undan på bänkarna, torka alla ytor och kör en extra omgång på golvet.',
        created_date: new Date('2025-01-03T18:00:00Z'),
        frequency: 7,
        points: 5,
        status: 'active',
        completions: [
          {
            household_member_id: members.sara.id,
            execution_date: new Date('2025-01-05T18:20:00Z'),
          },
          {
            household_member_id: members.leo.id,
            execution_date: new Date('2025-01-12T17:45:00Z'),
          },
        ],
      },
      {
        id: 'seed-task-trash-run',
        created_by: members.leo.id,
        household_id: 'seed-household-lugnagrand',
        title: 'Ta ut soporna',
        description:
          'Samla ihop alla sopor och matavfall och gå till miljöstationen.',
        created_date: new Date('2025-01-08T07:30:00Z'),
        frequency: 2,
        points: 2,
        status: 'active',
        completions: [
          {
            household_member_id: members.maja.id,
            execution_date: new Date('2025-01-09T07:10:00Z'),
          },
          {
            household_member_id: members.leo.id,
            execution_date: new Date('2025-01-11T07:05:00Z'),
          },
        ],
      },
    ],
  },
  {
    id: 'seed-household-stadsvy',
    created_by: members.noah.id,
    name: 'Stadsvy 12',
    invitation_code: 'STADSVY-12',
    users: [
      members.noah,
      {
        ...members.linn,
        role: 'admin',
      },
      {
        ...members.maja,
        role: 'member',
        icon: 'pig',
      },
    ],
    tasks: [
      {
        id: 'seed-task-laundry-day',
        created_by: members.noah.id,
        household_id: 'seed-household-stadsvy',
        title: 'Tvätta veckans tvätt',
        description:
          'Tvätta två maskiner, häng upp tvätten och vik det som är torrt.',
        created_date: new Date('2025-01-04T09:00:00Z'),
        frequency: 7,
        points: 4,
        status: 'active',
        completions: [
          {
            household_member_id: members.noah.id,
            execution_date: new Date('2025-01-04T12:15:00Z'),
          },
          {
            household_member_id: members.linn.id,
            execution_date: new Date('2025-01-11T11:40:00Z'),
          },
        ],
      },
      {
        id: 'seed-task-water-plants',
        created_by: members.linn.id,
        household_id: 'seed-household-stadsvy',
        title: 'Vattna alla växter',
        description:
          'Gå igenom vardagsrum, kök och balkong och ge växterna en rejäl dusch.',
        created_date: new Date('2025-01-02T17:15:00Z'),
        frequency: 5,
        points: 3,
        status: 'active',
        completions: [
          {
            household_member_id: members.linn.id,
            execution_date: new Date('2025-01-07T17:10:00Z'),
          },
          {
            household_member_id: members.maja.id,
            execution_date: new Date('2025-01-12T08:30:00Z'),
          },
        ],
      },
      {
        id: 'seed-task-recycle-paper',
        created_by: members.noah.id,
        household_id: 'seed-household-stadsvy',
        title: 'Åka till återvinningen',
        description:
          'Ta papper, glas och metall till återvinningsstationen på hörnet.',
        created_date: new Date('2024-12-29T10:00:00Z'),
        frequency: 14,
        points: 6,
        status: 'archived',
        completions: [
          {
            household_member_id: members.noah.id,
            execution_date: new Date('2025-01-13T10:45:00Z'),
          },
        ],
      },
    ],
  },
];

const seedDatabase = async () => {
  let householdsSeeded = 0;
  let tasksSeeded = 0;

  for (const { tasks, ...household } of seedHouseholds) {
    const { id, ...householdData } = household;
    const householdRef = doc(collection(db, 'households'), id);

    await setDoc(householdRef, householdData);
    householdsSeeded += 1;

    for (const task of tasks) {
      const { id: taskId, completions, ...taskData } = task;
      const taskRef = doc(collection(db, 'tasks'), taskId);

      await setDoc(taskRef, {
        ...taskData,
        users: completions.map(createCompletion),
        created_date: Timestamp.fromDate(task.created_date),
      });
      tasksSeeded += 1;
    }
  }

  return { householdsSeeded, tasksSeeded };
};

export { seedDatabase };
