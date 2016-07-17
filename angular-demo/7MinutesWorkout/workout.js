//define an exercise
function Exercise(args) {
    this.name = args.name;
    this.title = args.title;
    this.description = args.description;
    this.image = args.image;
    this.related = {};
    this.related.videos = args.videos;
    this.nameSound = args.nameSound;
    this.procedure = args.procedure;
}

//define the plan
function Plan(args) {
    this.exercises = [];
    this.name = args.name;
    this.title = args.title;
    this.restBetweenExercise = args.restBetweenExercise;
}

//create a workout plan, add 12 exercises into a plan


var workout = new Plan({
    name: "7minWorkout",
    title: "7 Minute Workout",
    restBetweenExercise: 10
});

workout.exercises.push({
    exercise: new Exercise({
        name: "jumpingJacks",
        title: "Jumping Jacks",
        description: "Jumping Jacks.",
        image: "img/JumpingJacks.png",
        videos: [],
        variations: [],
        procedure: ""
    }),
    duration: 30
});

workout.exercises.push({
    exercise: new Exercise({
        name: "wallSit",
        title: "Wall Sit",
        description: "Wall Sit.",
        image: "img/wallsit.png",
        videos: [],
        variations: [],

    }),
    duration: 30
});

workout.exercises.push({
    exercise: new Exercise({
        name: "pushUp",
        title: "Push Up",
        description: "Discription about pushup.",
        image: "img/pushup.png",
        videos: ["https://www.youtube.com/watch?v=Eh00_rniF8E", "https://www.youtube.com/watch?v=ZWdBqFLNljc", "https://www.youtube.com/watch?v=UwRLWMcOdwI", "https://www.youtube.com/watch?v=ynPwl6qyUNM", "https://www.youtube.com/watch?v=OicNTT2xzMI"],
        variations: ["Planche push-ups", "Knuckle push-ups", "Maltese push-ups", "One arm versions"],
        procedure: ""
    }),
    duration: 30
});

workout.exercises.push({
    exercise: new Exercise({
        name: "crunches",
        title: "Abdominal Crunches",
        description: "Abdominal Crunches.",
        image: "img/crunches.png",
        videos: [],
        variations: [],
        procedure: ""
    }),
    duration: 30
});

workout.exercises.push({
    exercise: new Exercise({
        name: "stepUpOntoChair",
        title: "Step Up Onto Chair",
        description: "Step Up Onto Chair.",
        image: "img/stepUpOntoChair.jpeg",
        videos: [],
        variations: [],
        procedure: ""
    }),
    duration: 30
});

workout.exercises.push({
    exercise: new Exercise({
        name: "squat",
        title: "Squat",
        description: "Squat.",
        image: "img/squat.png",
        videos: [],
        variations: [],
        procedure: ""
    }),
    duration: 30
});

workout.exercises.push({
    exercise: new Exercise({
        name: "tricepdips",
        title: "Tricep Dips On Chair",
        description: "Tricep Dips On Chair.",
        image: "img/tricepdips.jpg",
        videos: [],
        variations: [],
        procedure: ""
    }),
    duration: 30
});

workout.exercises.push({
    exercise: new Exercise({
        name: "plank",
        title: "Plank",
        description: "Plank.",
        image: "img/plank.png",
        videos: [],
        variations: [],
        procedure: ""
    }),
    duration: 30
});

workout.exercises.push({
    exercise: new Exercise({
        name: "highKnees",
        title: "High Knees",
        description: "High Knees.",
        image: "img/highknees.png",
        videos: [],
        variations: [],
        procedure: ""
    }),
    duration: 30
});

workout.exercises.push({
    exercise: new Exercise({
        name: "lunges",
        title: "Lunges",
        description: "Lunges.",
        image: "img/lunges.png",
        videos: [],
        variations: [],
        procedure: ""
    }),
    duration: 30
});

workout.exercises.push({
    exercise: new Exercise({
        name: "pushupNRotate",
        title: "Pushup And Rotate",
        description: "Pushup And Rotate.",
        image: "img/pushupNRotate.jpg",
        videos: [],
        variations: [],
        procedure: ""
    }),
    duration: 30
});

workout.exercises.push({
    exercise: new Exercise({
        name: "sidePlank",
        title: "Side Plank",
        description: "Side Plank.",
        image: "img/sideplank.png",
        videos: [],
        variations: [],
        procedure: ""
    }),
    duration: 30
});

var restExercise = {
    details: new Exercise({
        name: "rest",
        title: " Relax!",
        description: " Relax a bit!",
        image: "img/rest.png",
    }),
    duration: workout.restBetweenExercise
};
