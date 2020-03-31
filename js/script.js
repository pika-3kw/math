document.addEventListener("DOMContentLoaded", () => {
  const testBlock = document.querySelector("#test");
  const done = document.querySelector("#done");

  const processing = document.querySelector(".progress-bar__processing");
  const progressValueNumber = document.querySelector(".progress-bar__number");

  let blank, exercise;

  /**
   * Fetch data API
   * calc: num1  sign  num2  =  result
   * data {
      id: "1",
      num1: {
        type: Number
      },
      sign: {
        type: String,
        options: ["+", "-", "*", "/"]
      },
      num2: {
        type: Number
      },
      result: {
        type: Number
      },
      question: {
        type: Number,
        options: {
          [
            "0",  // num1 is blank
            "1",  // num2 is blank
            "2"   // result is blank
          ]
        }
      },
   * }
   */
  const dataFetch = {
    type: "VARIOUS_EQUATIONS",
    total: 4,
    exercises: [
      {
        id: "1",
        num1: 2,
        sign: "+",
        num2: 3,
        result: 5,
        question: 0
      },
      {
        id: "2",
        num1: 5,
        sign: "-",
        num2: 3,
        result: 2,
        question: 1
      },
      {
        id: "3",
        num1: 1,
        sign: "+",
        num2: 2,
        result: 3,
        question: 0
      },
      {
        id: "4",
        num1: 9,
        sign: "-",
        num2: 5,
        result: 4,
        question: 1
      }
    ]
  };

  const total = dataFetch.total;

  // Correct answer
  let answer = 0;

  /**
   *
   * @param {*} data exercise data {id, num1, sign, num2, result, question}
   * @param {*} state if "HIDDEN" exercise visible; default = "DISPLAY"
   */
  const createExercise = (data, state = "DISPLAY") => {
    const exercise = document.createElement("DIV");
    let num1, num2, result;

    if (data.question === 0) {
      num1 = document.createElement("INPUT");
      num1.className = "blank";
      num1.dataset.id = data.id;
    } else {
      num1 = document.createElement("SPAN");
      num1.innerHTML = data.num1;
    }

    let sign = document.createElement("SPAN");
    sign.innerHTML = data.sign;

    if (data.question === 1) {
      num2 = document.createElement("INPUT");
      num2.className = "blank";
      num2.dataset.id = data.id;
    } else {
      num2 = document.createElement("SPAN");
      num2.innerHTML = data.num2;
    }

    let equal = document.createElement("SPAN");
    equal.innerHTML = "=";

    if (data.question === 2) {
      result = document.createElement("INPUT");
      result.className = "blank";
      result.dataset.id = data.id;
    } else {
      result = document.createElement("SPAN");
      result.innerHTML = data.result;
    }

    exercise.appendChild(num1);
    exercise.appendChild(sign);
    exercise.appendChild(num2);
    exercise.appendChild(equal);
    exercise.appendChild(result);

    if (state === "HIDDEN") {
      exercise.className = "exercise hidden";
    } else {
      exercise.className = "exercise";
    }

    return exercise;
  };

  /**
   *
   * @param {*} data test data from API
   */
  const createTest = data => {
    testBlock.innerHTML = ``;

    const { exercises } = data;

    exercises.forEach((elem, i) => {
      let ex, state;
      if (i > 0) {
        state = "HIDDEN";
      }
      ex = createExercise(elem, state);
      testBlock.appendChild(ex);
    });
    blank = document.querySelector("input.blank");
  };

  /**
   *
   * @param {*} id id of exercise
   * @param {*} answer user's answer
   */
  const check = (id, answer) => {
    const exercise = dataFetch.exercises.find(elem => elem.id === id);
    // giải thích: +answer : chuyển String thành Number
    if (exercise.question === 0 && +answer === exercise.num1) {
      return true;
    }

    if (exercise.question === 1 && +answer === exercise.num2) {
      return true;
    }

    if (exercise.question === 2 && +answer === exercise.result) {
      return true;
    }

    return false;
  };

  createTest(dataFetch);

  processing.style.width = "0px";
  progressValueNumber.innerHTML = 0;

  document.addEventListener("keydown", () => {
    // if not DONE! reset value of blank
    if (answer < total) {
      blank.value = "";
      blank.focus();
    }
    // if DONE! unfocus input field
    if (answer >= total) {
      blank.blur();
    }
  });

  document.addEventListener("keyup", () => {
    // if user input is not a Number, reset input field
    // Nếu không phải là chuỗi số thì +value sẽ thành NaN (not a number)
    if (isNaN(+blank.value)) {
      blank.value = "";
      return;
    }

    const result = check(blank.dataset.id, blank.value);

    if (result && answer < total) {
      blank.className = "true";

      answer += 1;

      progressValueNumber.innerHTML = (answer / total) * 100;
      processing.style.width = `${(answer / total) * 100}%`;

      if (answer < total) {
        exercise = testBlock.querySelector(".hidden");
        exercise.classList.remove("hidden");

        blank = exercise.querySelector(".blank");
        blank.focus();
      }
    }

    if (answer >= total) {
      done.classList.add("show");
    }
  });
});
