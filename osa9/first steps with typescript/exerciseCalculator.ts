interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const parseArguments = (
  args: Array<string>
): { target: number; daily_exercises: Array<number> } => {
  if (args.length < 4) throw new Error("Not enough arguments");
  if (args.slice(2).every((arg) => !isNaN(Number(arg)))) {
    return {
      target: Number(args[2]),
      daily_exercises: args.slice(3).map((arg) => Number(arg)),
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

const calculateExercises = (
  daily_exercises: Array<number>,
  target: number
): Result => {
  const periodLength = daily_exercises.length;
  const trainingDays = daily_exercises.filter((d) => d > 0).length;
  const average =
    daily_exercises.reduce((acc, cur) => acc + cur, 0) / periodLength;
  const success = average >= target;
  const rating = success ? 3 : average >= target - 1 ? 2 : 1;
  const ratingDescription =
    rating === 3
      ? "Excellent"
      : rating === 2
        ? "Not too bad but could be better"
        : "Poor";

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

try {
  const { target, daily_exercises } = parseArguments(process.argv);
  console.log(calculateExercises(daily_exercises, target));
} catch (error: unknown) {
  let errorMessage = "Something bad happened.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
}

export { calculateExercises };
export type { Result };
