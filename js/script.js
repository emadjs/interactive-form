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