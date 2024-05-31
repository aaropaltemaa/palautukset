const Course = ({ courses}) => {
    const allParts = courses.flatMap(course => course.parts)
    return (
        <div>
            <Header courses={courses} />
            <Content courses={courses} />
            <Total parts={allParts} />
        </div>
  )
}

const Header = () => <h1>Web development curriculum</h1>
    

const Content = ({ courses }) => {
    return (
        <div>
            {courses.map(course => (
                <div key={course.id}>
                    <h2>{course.name}</h2>
                    {course.parts.map(part => (
                        <p key={part.id}>{part.name} {part.exercises}</p>
                    ))}
                </div>
            ))}
        </div>
    )
}

const Total = ({parts}) => {
    const totalExercises = parts.reduce((accumulator, currentPart) => {
        console.log("Accumulator", accumulator)
        console.log("Current part", currentPart)
        return accumulator + currentPart.exercises
    }, 0)

    return <p><strong>Total of {totalExercises} exercises</strong></p>
}

export default Course
