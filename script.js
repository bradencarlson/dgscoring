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

function create_hole(number) {
        return "<p>Hole number " + number + "</p>"
}

function create_score_card() {
        course_string = ""
        for (i=1; i<= 9; i = i + 1) {
                course_string = course_string + create_hole(i) + "\n"
        }
        return course_string
}

function load() {
        const course_holes_element = document.getElementById('course-holes')
        course_holes_element.innerHTML = create_score_card()
}

function toggleSideMenu() {
        console.log("Function not implemented yet.")
}

function lookUpPar(dist, elev = 0, heavy_foliage = 0, skill = "red") {
        const s = new SkillLevel(skill)
        effective_dist = dist + 3*elev;

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
