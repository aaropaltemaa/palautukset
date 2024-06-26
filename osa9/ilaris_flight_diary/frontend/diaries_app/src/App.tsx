import { useState, useEffect } from "react";
import { Diary } from "./types";
import { getAllDiaries, addDiary } from "./diaryService";

const Content = ({ diaries }: { diaries: Diary[] }) => {
  if (diaries.length === 0) {
    return <div>No diaries</div>;
  }

  return (
    <div>
      {diaries.map((diary) => (
        <div key={diary.id}>
          <h3>{diary.date}</h3>
          <div>weather - {diary.weather}</div>
          <div>visibility - {diary.visibility}</div>
          <div>{diary.comment}</div>
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [date, setDate] = useState("");
  const [weather, setWeather] = useState("");
  const [visibility, setVisibility] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllDiaries().then((data) => {
      setDiaries(data);
    });
  }, []);

  const createDiary = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const newDiary = {
      date,
      weather,
      visibility,
      comment,
    };
    const result = await addDiary(newDiary);
    if (result.error) {
      setError(result.error);
    } else {
      if (result.data !== undefined) {
        setDiaries(diaries.concat(result.data));
      } else {
        console.error("Failed to add diary: result.data is undefined");
      }
      setDate("");
      setWeather("");
      setVisibility("");
      setComment("");
      setError(null);
    }
  };

  return (
    <div>
      <h2>add new diary</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form onSubmit={createDiary}>
        {/* form content */}
        <div>
          date
          <input
            type="date"
            value={date}
            onChange={({ target }) => setDate(target.value)}
          />
        </div>
        <div>
          weather sunny
          <input
            type="radio"
            name="diary"
            value="sunny"
            onChange={({ target }) => setWeather(target.value)}
          />
          rainy
          <input
            type="radio"
            name="diary"
            value="rainy"
            onChange={({ target }) => setWeather(target.value)}
          />
          cloudy
          <input
            type="radio"
            name="diary"
            value="cloudy"
            onChange={({ target }) => setWeather(target.value)}
          />
          stormy
          <input
            type="radio"
            name="diary"
            value="stormy"
            onChange={({ target }) => setWeather(target.value)}
          />
          windy
          <input
            type="radio"
            name="diary"
            value="windy"
            onChange={({ target }) => setWeather(target.value)}
          />
        </div>
        <div>
          visibility great
          <input
            type="radio"
            name="diary"
            value="great"
            onChange={({ target }) => setVisibility(target.value)}
          />
          good
          <input
            type="radio"
            name="diary"
            value="good"
            onChange={({ target }) => setVisibility(target.value)}
          />
          ok
          <input
            type="radio"
            name="diary"
            value="ok"
            onChange={({ target }) => setVisibility(target.value)}
          />
          poor
          <input
            type="radio"
            name="diary"
            value="poor"
            onChange={({ target }) => setVisibility(target.value)}
          />
        </div>
        <div>
          <input
            placeholder="comment"
            value={comment}
            onChange={({ target }) => setComment(target.value)}
          />
        </div>
        <button type="submit">save</button>
      </form>
      <h2>diaries</h2>
      <Content diaries={diaries} />
    </div>
  );
};

export default App;
