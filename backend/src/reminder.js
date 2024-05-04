import schedule from "node-schedule";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import { db } from "./db.js";
dayjs.extend(customParseFormat);

const reminders = {};

export async function initRemindersOfAllUsers() {
  console.log("Initializating reminders of users...");

  const [allUsersReminders] = await db.query(
    `SELECT user.name, user.phone, reminder.*
     FROM reminder
     INNER JOIN user ON reminder.user_id = user.id`,
  );

  for (const userReminders of allUsersReminders) {
    setRemindersOfUser(
      userReminders.name,
      userReminders.phone,
      [
        userReminders.water_01,
        userReminders.water_02,
        userReminders.water_03,
        userReminders.water_04,
        userReminders.water_05,
        userReminders.water_06,
        userReminders.water_07,
      ],
      [
        userReminders.workout_sun,
        userReminders.workout_mon,
        userReminders.workout_tue,
        userReminders.workout_wed,
        userReminders.workout_thru,
        userReminders.workout_fri,
        userReminders.workout_sat,
      ],
    );
  }
}

export async function initRemindersOfAUser(phone) {
  const [userReminders] = await db.query(
    `SELECT user.name, user.phone, reminder.*
     FROM reminder
     INNER JOIN user ON reminder.user_id = user.id
     WHERE user.phone = ?`,
    [phone],
  );

  setRemindersOfUser(
    userReminders[0].name,
    userReminders[0].phone,
    [
      userReminders[0].water_01,
      userReminders[0].water_02,
      userReminders[0].water_03,
      userReminders[0].water_04,
      userReminders[0].water_05,
      userReminders[0].water_06,
      userReminders[0].water_07,
    ],
    [
      userReminders[0].workout_sun,
      userReminders[0].workout_mon,
      userReminders[0].workout_tue,
      userReminders[0].workout_wed,
      userReminders[0].workout_thru,
      userReminders[0].workout_fri,
      userReminders[0].workout_sat,
    ],
  );
}

export function removeReminderOfUser(phone) {
  const reminderJobs = reminders[phone];
  if (!reminderJobs) {
    return;
  }

  for (const job of reminderJobs) {
    job.cancel();
  }
  delete reminders[phone];
}

export function setRemindersOfUser(
  name,
  phone,
  waterReminders,
  workoutReminders,
) {
  const newReminderJobs = [];

  // Water intakes
  for (const time of waterReminders) {
    const timeParsed = dayjs(time, "h:mm a");
    if (!timeParsed) {
      continue;
    }

    const rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = [new schedule.Range(0, 6)];
    rule.hour = timeParsed.hour();
    rule.minute = timeParsed.minute();

    const newJob = schedule.scheduleJob(rule, async function () {
      await fetch("https://api.sparrowsms.com/v2/sms/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: "v2_JVEAq00nf1rJrOQNkySw0crF2Bw.adQJ",
          from: "TheAlert",
          to: phone,
          text: `Hello ${name}!\n\nThis is a friendly reminder from MealMate about your water intake!\n\nStay hydrated!`,
        }),
      });
    });
    newReminderJobs.push(newJob);
  }

  // Workout
  for (let i = 0; i < workoutReminders.length; i++) {
    const time = workoutReminders[i];
    if (time == "") {
      continue;
    }
    const timeParsed = dayjs(time, "h:mm a");
    if (!timeParsed) {
      continue;
    }

    const rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = [i];
    rule.hour = timeParsed.hour();
    rule.minute = timeParsed.minute();

    const newJob = schedule.scheduleJob(rule, async function () {
      await fetch("https://api.sparrowsms.com/v2/sms/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: "v2_JVEAq00nf1rJrOQNkySw0crF2Bw.adQJ",
          from: "TheAlert",
          to: phone,
          text: `Hello ${name}!\n\nThis is a friendly reminder from MealMate about your workout!\n\nStay active!`,
        }),
      });
    });
    newReminderJobs.push(newJob);
  }

  reminders[phone] = newReminderJobs;
}
