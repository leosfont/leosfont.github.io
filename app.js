const gitHubApiUrl = "https://api.github.com";

new Vue({
    el: '#app',
    data: {
        gitHubProfile: {},
        gitHubRepositories: [],
        projects: [],
        technologies: [],
        showNotification: true,
        currentComponent: 'projects',
    },
    mounted() {
        this.getProjectsJson();
        this.getGitHubProfile();
        this.getGitHubRepositories();
    },
    methods: {
        getProjectsJson()
        {
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
                                this.technologies.push({ name: integrationsTool, type: 'Integrations' });
                            }
                        });
                    }
                });
            })
            .catch(error => console.error(error));
        },
        getGitHubProfile()
        {
            fetch(`${gitHubApiUrl}/users/leosfont`)
            .then(response => response.json())
            .then(data => {
                this.gitHubProfile = data;
                console.log(this.gitHubProfile);
            })
            .catch(error => console.log(error));
        },
        getGitHubRepositories()
        {
            fetch(`${gitHubApiUrl}/users/leosfont/repos`)
            .then(response => response.json())
            .then(data => {
                this.gitHubRepositories = data;
                console.log(this.gitHubProfile);
            })
            .catch(error => console.log(error));
        }
    }
});