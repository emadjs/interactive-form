// Basic Info
document.querySelector("#name").focus()
const otherJobInput = document.querySelector("#other-job-role")
otherJobInput.style.display = "none"

const jobRoleSelect = document.querySelector("#title")
jobRoleSelect.addEventListener("change", (e) => {
    if (e.target.value === "other") {
        otherJobInput.style.display = ""
    } else
        otherJobInput.style.display = "none"
})
// T-Shirt Info
const shirtColorsSelect = document.querySelector("#color")
shirtColorsSelect.disabled = true

const shirtDesignSelect = document.querySelector("#design")
shirtDesignSelect.addEventListener("change", (e) => {
    shirtColorsSelect.disabled = false
    console.log();
    [].forEach.call(shirtColorsSelect.options, (option) => {
        option.getAttribute("data-theme") === e.target.value ? option.style.display = "" : option.style.display = "none"
    })
})

// Register for Activities *
let totalCost = 0
const activities = document.querySelector("#activities")
let activitiesCost = document.querySelector("#activities-cost")

activities.addEventListener("change", (e) => {
    const currentActivity = e.target
    const conflictActivities = findConflicts(currentActivity)
    disableConflicts(currentActivity, conflictActivities)
    const cost = +e.target.parentNode.querySelector(".activity-cost").textContent.slice(1)
    e.target.checked ? totalCost += cost : totalCost -= cost
    activitiesCost.textContent = `Total: $${totalCost}`
})

function readTime(str) {
    if (!str) return
    let [start, end] = str.split("-")
    startNumber = parseInt(start)
    startNumber = startNumber + (start.includes("pm") && startNumber < 12 ? 12 : 0)
    endNumber = parseInt(end)
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











