/**************************************************
 * Classes
 **************************************************/

class SkillLevel {
        constructor(level = "green") {
                if (level == "purple") {
                        this.light_foliage = [0, 225, 450, 660]
                        this.heavy_foliage = [0, 180, 375, 570]
                } else if (level == "green") {
                        this.light_foliage = [0, 330, 535, 870]
                        this.heavy_foliage = [0, 260, 440, 720]
                } else if (level == "red") {
                        this.light_foliage = [100, 375, 650, 900]
                        this.heavy_foliage = [100, 300, 550, 800]
                } else if (level == "white") {
                        this.light_foliage = [125, 450, 650, 1000]
                        this.heavy_foliage = [100, 350, 600, 850]
                } else if (level == "blue") {
                        this.light_foliage = [150, 525, 800, 1200]
                        this.heavy_foliage = [125, 425, 700, 1000]
                } else if (level == "gold") {
                        this.light_foliage = [225, 650, 1000, 1300]
                        this.heavy_foliage = [150, 525, 850, 1100]
                } else {
                        this.light_foliage = [0, 330, 535, 870]
                        this.heavy_foliage = [0, 260, 440, 720]
                }
        }
}

class Course {
        constructor(name, num_holes, pars) {
                this.name = name
                if (num_holes <= 9) {
                        this.holes = 9
                        if (pars.length < 9) {
                                this.par = [0,0,0,0,0,0,0,0,0]
                        } else {
                                for (i=0; i< 9; i = i+1) {
                                        this.par[i] = pars[i];
                                }
                        }
                } else {
                        this.holes = 18
                        if (pars.length < 18) {
                                this.par = [0,0,0,0,0,0,0,0,0]
                        } else {
                                for (i=0; i< 9; i = i+1) {
                                        this.par[i] = pars[i];
                                }
                        }
                }
        }
}


/**************************************************
 * Look Up Logic
 **************************************************/

function calculate(dist, elev = 0, heavy_foliage = 0, skill = "red") {
  const s = new SkillLevel(skill)
  effective_dist = dist + 3*(elev);

  if (!heavy_foliage) {
    for (i=0; i<s.light_foliage.length ; i = i + 1) {
      if (effective_dist < s.light_foliage[i]) {
        return i+2
      } 
    }
    return 6
  } else {
    for (i=0; i<s.heavy_foliage.length ; i = i + 1) {
      if (effective_dist < s.heavy_foliage[i]) {
        return i+2
      }
    }
    return 6
  }
}

function lookUpPar(e) {
  const dist = document.querySelector("input[id=lookup-distance]")
  const elev = document.querySelector("input[id=lookup-elevation]")
  const skill = document.querySelector("select[id=skill-select]")
  const foliage = document.querySelector("select[id=lookup-foliage]")

  heavy_foliage = foliage.value == "heavy" ? 1 : 0;

  if (skill.value != "all") {
    const element = document.querySelector("div[id=par-result]")
    element.innerText = calculate(parseInt(dist.value), 
                                  parseInt(elev.value),
                                  heavy_foliage,
                                  skill.value)
  } else {
    values = []
    for (level of ['purple','green','red','white','blue','gold']) {
      values.push(calculate(parseInt(dist.value), parseInt(elev.value), heavy_foliage, level))
    }
    console.log(values)
  }
}

/**************************************************
 * Event Handlers
 **************************************************/

function addClickHandlers() {
  const buttons = document.querySelectorAll("button")
  for (const button of buttons) {
    switch(button.id) {
      case "side-menu-button":
        break;
      case "lookup-calculate":
        button.addEventListener("click", lookUpPar)
        break;
      case "lookup-button":
        button.addEventListener("click", loadLookup)
        break;
      case "scorecard-button":
        button.addEventListener("click", loadPlayCourse)
        break;
      case "course-select-button":
        button.addEventListener("click", loadCourse)
        break;
      default: 
        break;
    }
  }

}


/**************************************************
 * Loading Pages
 **************************************************/

async function loadLookup(e) {
  try {
    const response = await fetch("./pages/lookup.html")

    if (!response.ok) {
      throw new Error("Something went wrong loading the lookup page.")
    }

    const lookup_page = await response.text()
    const main_element = document.querySelector("div[id=main]")
    main_element.innerHTML = lookup_page
    addClickHandlers()
  } catch (error) {
    throw new Error(error.message)
  }
}

async function loadPlayCourse(e) {
  try {
    const response = await fetch("./pages/playcourse.html")

    if (!response.ok) {
      throw new Error("Something went wrong loading the playcourse page.")
    }

    const playcourse_page = await response.text()

    const main = document.querySelector("div[id=main]")
    main.innerHTML = playcourse_page

    addClickHandlers()

  } catch (error) {
    throw new Error(error.message)
  }
}


/**************************************************
 * Load Course Logic
 **************************************************/

async function loadCourse() {
  try {

    const sel = document.querySelector("select[id=course-select-menu]")
    const course_name = sel.value

    if ( !/[a-z-]/.test(course_name) ) {
      throw new Error("Invalid course name.")
      return
    }
    const page_name = "./courses/" + course_name + ".json"

    console.log("Looking up: " + page_name)
    const response = await fetch(page_name)

    if (!response.ok) {
      throw new Error("Something went wrong loading the course.")
    }

    console.log(response.status)

    html = ""

    console.log("Getting json")

    const course = await response.json()

    console.log(course["name"])
    console.log(course["distance"])
    console.log(course["elevation"])
    console.log(course["foliage"])
    num_holes = parseInt(course["num_holes"])
    console.log(num_holes)

    for (let i=0; i<num_holes ; i++ ) {
      html = html + createHole(i,
                      course["distance"][i],
                      course["elevation"][i],
                      course["foliage"][i])
    }

    //console.log(html)

    const scorecard = document.querySelector("div[id=scorecard]")
    scorecard.innerHTML = html

  } catch (error) {
    throw new Error(error.error)
  }
}

function createHole(number, d, e, f) {
  nums = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]
  html = ""
  if ( nums.includes(number) ) {
    html += "<div id=\"hole-" + number + "\" class=\"hole\">"
    const skill_select = document.querySelector("select[id=difficulty-select]")
    const skill = skill_select.value
    const par = calculate(d,e,f,skill)
    html += "<div class=\"par-label\">" + par + "</div>"
    html += "<div class=\"distance-label\">" + d + "</div>"
    html += "<div class=\"user-score\">" 
      html += "<input type=\"text\" class=\"score\"></div>"

    html = html + "</div>"
    return html
  } else {
    return ""
  }
}
      
