new Vue({
    el: '#app',
    data: {
        projects: [],
        technologies: [],
        showNotification: true,
    },
    mounted() {
        fetch('./projects.json')
            .then(response => response.json())
            .then(data => {
                this.projects = data;
                this.projects.forEach(project => {
                    project.technologies.forEach(tech => {
                        if (!this.technologies.some(existingTech => existingTech.name === tech)) {
                            this.technologies.push({ name: tech, type: 'Technology' });
                        }
                    });
                    if (project.devops) {
                        project.devops.forEach(devopsTool => {
                            if (!this.technologies.some(existingTech => existingTech.name === devopsTool)) {
                                this.technologies.push({ name: devopsTool, type: 'DevOps' });
                            }
                        });
                    }
                    if (project.integrations) {
                        project.integrations.forEach(integrationsTool => {
                            if (!this.technologies.some(existingTech => existingTech.name === integrationsTool)) {
                                this.technologies.push({ name: integrationsTool, type: 'DevOps' });
                            }
                        });
                    }
                });
            })
            .catch(error => console.error(error));
    }
});