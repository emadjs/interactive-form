const name = document.querySelector("#name")
const otherJobInput = document.querySelector("#other-job-role")
const jobRoleSelect = document.querySelector("#title")

const shirtDesignSelect = document.querySelector("#design")
const shirtColorsSelect = document.querySelector("#color")


let totalPrice = 0
const activities = document.querySelector("#activities")
const activitiesBox = document.querySelector("#activities-box")
let activitiesCost = document.querySelector("#activities-cost")


const paymentBox = document.querySelector(".payment-method-box")
const paymentSelect = document.querySelector("#payment")
const creditCardDiv = document.querySelector("#credit-card")
const paypalDiv = document.querySelector("#paypal")
const bitcoinDiv = document.querySelector("#bitcoin")

// some helper functions for Activities
function readTime(str) {
    if (!str) return
    let [start, end] = str.split("-")
    let startNumber = parseInt(start)
    startNumber = startNumber + (start.includes("pm") && startNumber < 12 ? 12 : 0)
    let endNumber = parseInt(end)
    endNumber = endNumber + (end.includes("pm") && endNumber < 12 ? 12 : 0)
    return {startNumber, endNumber}
}

function findConflicts(activity) {
    const activityObjects = []
    const inputs = activities.querySelectorAll("input")
    Array.from(inputs).forEach((input) => {
        const fullTime = input.dataset.dayAndTime?.split(" ")[1]
        activityObjects.push({
            input,
            activityName: input.name,
            day: input.dataset.dayAndTime?.split(" ")[0],
            startTime: readTime(fullTime)?.startNumber,
            endTime: readTime(fullTime)?.endNumber,
        })
    })
    const activityObject = activityObjects.find(act => act.activityName === activity.getAttribute("name"))
    return activityObjects.filter(act =>
        act.activityName !== activityObject.activityName &&
        act.day === activityObject.day &&
        act.startTime <= activityObject.endTime &&
        act.endTime >= activityObject.endTime
    )
}

function disableConflicts(currentActivity, arrOfActivities) {
    arrOfActivities.forEach(activity => {
        currentActivity.checked ? activity.input.disabled = true : activity.input.disabled = false
    })
}


paymentBox.addEventListener("change", (e) => {
    [creditCardDiv, paypalDiv, bitcoinDiv].forEach((method) => {
        method.getAttribute("id") === e.target.value ? method.style.display = "" : method.style.display = "none"
    })
})


// validation
const email = document.querySelector("#email")
const ccNum = document.querySelector("#cc-num")
const zip = document.querySelector("#zip")
const cvv = document.querySelector("#cvv")
const form = document.querySelector("form")


const inputs = document.querySelectorAll("input")
inputs.forEach(input => {
    input.addEventListener("change", (e) => {
        if (e.target.checked) {
            input.parentElement.classList.add("focus");
        } else {

            input.parentElement.classList.add("blur")
            input.parentElement.classList.remove("focus");
        }
    })

})

function markAsValid(element) {
    element.parentElement.classList.add("valid")
    element.parentElement.classList.remove("not-valid")
    element.parentElement.lastElementChild.style.display = ""

}

function markAsNotValid(element) {
    element.parentElement.classList.remove("valid")
    element.parentElement.classList.add("not-valid")
    element.parentElement.lastElementChild.style.display = "block"
}


const inputsToValidate = {
    name: {
        input: name,
        regex: /^([\w]{3,})+\s+([\w\s]{3,})+$/i,
        error: "Name field can only contain letters, spaces, and hyphens.",
        blank: "Name field cannot be blank"
    },
    email: {
        input: email,
        regex: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
        error: "Email field can only contain letters, spaces, and hyphens.",
        blank: "Email field cannot be blank"
    },
}

const ccInputsToValidate = {
    ccNum: {
        input: ccNum,
        regex: /^\d{13,16}$/,
        error: "Credit card number must be between 13 and 16 digits.",
        blank: "Credit card field cannot be blank"
    },
    zip: {
        input: zip,
        regex: /^\d{5}$/,
        error: "Zip code must be 5 digits.",
        blank: "Zip code field cannot be blank"
    },
    cvv: {
        input: cvv,
        regex: /^\d{3}$/,
        error: "CVV must be 3 digits.",
        blank: "CVV field cannot be blank"
    },
}


function SetFormInitialState() {
    inputsToValidate.name.input.focus()
    otherJobInput.style.display = "none"
    shirtColorsSelect.disabled = true
    document.querySelector('option[value="credit-card"]').selected = "selected"
    paypalDiv.style.display = "none"
    bitcoinDiv.style.display = "none"
}

function validate(props) {
    const isValid = props.regex.test(props.input.value.trim())
    const isBlank = props.input.value.trim().length === 0
    if (isValid) {
        markAsValid(props.input)
    } else {
        markAsNotValid(props.input)
        const hint = props.input.parentElement.lastElementChild
        hint.textContent = isBlank ? props.blank : props.error
    }
    return isValid
}

const validateActivities = () => {
    const isValid = totalPrice > 0;
    if (isValid) {
        markAsValid(activitiesBox);
    } else {
        markAsNotValid(activitiesBox);
    }
    return isValid;
}


document.addEventListener("DOMContentLoaded", (e) => {

    SetFormInitialState()

    //  basic info
    jobRoleSelect.addEventListener("change", (e) => {
        if (e.target.value === "other") {
            otherJobInput.style.display = ""
        } else
            otherJobInput.style.display = "none"
    })

    // T-Shirt Info
    shirtDesignSelect.addEventListener("change", (e) => {
        shirtColorsSelect.disabled = false
        console.log();
        [].forEach.call(shirtColorsSelect.options, (option) => {
            option.getAttribute("data-theme") === e.target.value ? option.style.display = "" : option.style.display = "none"
        })
    })

    // Register for Activities *
    activities.addEventListener("change", (e) => {
        const currentActivity = e.target
        const conflictActivities = findConflicts(currentActivity)
        disableConflicts(currentActivity, conflictActivities)
        const cost = +e.target.parentNode.querySelector(".activity-cost").textContent.slice(1)
        totalPrice += e.target.checked ? cost : -cost
        activitiesCost.textContent = `Total: $${totalPrice}`
        validateActivities()
    })

    Object.values(inputsToValidate).forEach(props => {
        props.input.addEventListener("keyup", () => {
            validate(props)
        })
    })
    Object.values(ccInputsToValidate).forEach(props => {
        props.input.addEventListener("keyup", () => {
            const isCCMethodSelected = paymentSelect.value === "credit-card"
            if (isCCMethodSelected) {
                !validate(props) ? e.preventDefault() : null
            }
        })
    })

    form.addEventListener("submit", (e) => {

        Object.values(inputsToValidate).forEach(props => {
            !validate(props) ? e.preventDefault() : null
        })
        !validateActivities() ? e.preventDefault() : null

        Object.values(ccInputsToValidate).forEach(props => {
            const isCCMethodSelected = paymentSelect.value === "credit-card"
            if (isCCMethodSelected) {
                !validate(props) ? e.preventDefault() : null
            }
        })
    })


})