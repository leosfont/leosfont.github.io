const gitHubApiUrl = "https://api.github.com";

new Vue({
    el: '#app',
    data: {
        contact: {
            email: 'leosfont@gmail.com',
            whatsappPhone: '555185038783',
        },
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
                    project.develop_technologies.forEach(tech => {
                        if (!this.technologies.some(existingTech => existingTech.name === tech)) {
                            this.technologies.push({ name: tech, type: 'Technology' });
                        }
                    });
                    if (project.devops_technologies) {
                        project.devops_technologies.forEach(devopsTool => {
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
                console.log(this.gitHubRepositories);
            })
            .catch(error => console.log(error));
        },
        
        printCV() {
            const html = `
                <html>
                    <head>
                        <title>CV - ${this.gitHubProfile.name}</title>
                        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                    </head>
                    <body class="bg-gray-100 text-gray-900 p-8">
                        <header class="text-center my-8">
                            <img src="${this.gitHubProfile.avatar_url}" alt="${this.gitHubProfile.name}" class="mx-auto rounded-full w-32 h-32 mb-4">
                            <h1 class="text-3xl font-bold">${this.gitHubProfile.name}</h1>
                        </header>
                        
                        <section class="mb-8">
                            <h2 class="text-2xl font-semibold mb-4">Contact Information</h2>
                            <p><strong>Address:</strong> ${this.gitHubProfile.location}</p>
                            <p><strong>Email:</strong> ${this.contact.email}</p>
                            <p><strong>Phone/Whatsapp:</strong> ${this.contact.whatsappPhone}</p>
                            <p><strong>Portfolio:</strong> <a href="${this.gitHubProfile.blog}" class="text-blue-500 underline" target="_blank">${this.gitHubProfile.blog}</a></p>
                        </section>
                        
                        <section>
                            <h2 class="text-2xl font-semibold mb-4">Projects</h2>
                            ${this.projects.map(project => `
                                <div class="mb-8 pb-4 border-b border-gray-300">
                                    <h3 class="text-xl font-semibold mb-2">${project.project_name}</h3>
                                    ${project.image ? `<img src="${project.image}" alt="Project Image" class="max-w-xs mb-4">` : ''}
                                    <p><strong>Company:</strong> ${project.company_name}</p>
                                    <p><strong>Duration:</strong> ${project.duration}</p>
                                    <p><strong>DevOps Technologies:</strong> ${(project.devops_technologies || []).join(', ')}</p>
                                    ${project.methodologies?.length ? `<p><strong>Methodologies:</strong> ${(project.methodologies || []).join(', ')}</p>` : ''}
                                    <p><strong>Develop Technologies:</strong> ${(project.develop_technologies || []).join(', ')}</p>
                                    ${project.integrations?.length ? `<p><strong>Integrations:</strong> ${(project.integrations || []).join(', ')}</p>` : ''}
                                    ${project.description ? `<p><strong>Description:</strong> ${project.description}</p>` : ''}
                                </div>
                            `).join('')}
                        </section>
                    </body>
                </html>
            `;
        
            const printWindow = window.open('', '', 'height=600,width=800');
            printWindow.document.open();
            printWindow.document.write(html);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
        }
    }
});