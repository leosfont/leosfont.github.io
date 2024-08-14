const gitHubApiUrl = "https://api.github.com";

new Vue({
    el: '#app',
    data: {
        user: {
            name: 'Léo Fontoura',
            bio: 'Senior Software Developer',
            email: 'leosfont@gmail.com',
            whatsappPhone: '555185038783',
            location: 'Viamão RS',
            portfolioUrl: 'https://leosfont.github.io',
            linkedinUrl: 'https://www.linkedin.com/in/leosfont/',
            avatar: './avatar.jpeg',
            projects: [],
        },
        gitHubRepositories: [],
        projects: [],
        technologies: [],
        showNotification: true,
        currentComponent: 'projects',
        language: 'en',
        labels: {}
    },
    mounted() {
        this.loadLanguageFiles();
        this.getGitHubRepositories();
    },
    methods: {
        loadLanguageFiles() {
            const projectsFile = `./projects.json`;
            const labelsFile = `./labels.json`;

            fetch(labelsFile)
                .then(response => response.json())
                .then(data => {
                    this.labels= data.lang[this.language];
                    console.log('labels', this.labels)
                })
                .catch(error => console.error(error));

            fetch(projectsFile)
                .then(response => response.json())
                .then(data => {
                    this.projects = data;
                    this.processTechnologies();
                })
                .catch(error => console.error(error));
        },
        getGitHubRepositories() {
            fetch(`${gitHubApiUrl}/users/leosfont/repos`)
                .then(response => response.json())
                .then(data => {
                    this.gitHubRepositories = data;
                    console.log(this.gitHubRepositories);
                })
                .catch(error => console.log(error));
        },
        processTechnologies() {
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
        },
        printCV() {
            const html = `
                <html>
                    <head>
                        <title>CV - ${this.user.name}</title>
                        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                    </head>
                    <body class="bg-gray-100 text-gray-900 p-8">
                        <header class="text-center my-8">
                            <img src="${this.user.avatar}" alt="${this.user.name}" class="mx-auto rounded-full w-32 h-32 mb-4">
                            <h1 class="text-3xl font-bold">${this.user.name}</h1>
                        </header>
                        
                        <section class="mb-8">
                            <h2 class="text-2xl font-semibold mb-4">${this.labels.contact_information}</h2>
                            <p><strong>${this.labels.address}:</strong> ${this.user.location}</p>
                            <p><strong>${this.labels.email}:</strong> ${this.user.email}</p>
                            <p><strong>${this.labels.phone_whatsapp}:</strong> ${this.user.whatsappPhone}</p>
                            <p><strong>${this.labels.portfolio}:</strong> <a href="${this.user.portfolioUrl}" class="text-blue-500 underline" target="_blank">${this.user.portfolioUrl}</a></p>
                            <p><strong>Linkedin:</strong> <a href="${this.user.linkedinUrl}" class="text-blue-500 underline" target="_blank">${this.user.linkedinUrl}</a></p>
                        </section>
                        
                        <section>
                            <h2 class="text-2xl font-semibold mb-4">${this.labels.projects}</h2>
                            ${this.projects.map(project => 
                                `<div class="mb-8 pb-4 border-b border-gray-300">
                                    <h3 class="text-xl font-semibold mb-2">${project.lang[this.language].project_name}</h3>
                                    ${project.image ? `<img src="${project.image}" alt="Project Image" class="max-w-xs mb-4">` : ''}
                                    <p><strong>${this.labels.company}:</strong> ${project.company_name}</p>
                                    <p><strong>${this.labels.duration}:</strong> ${project.duration}</p>
                                    <p><strong>${this.labels.devops_technologies}:</strong> ${(project.devops_technologies || []).join(', ')}</p>
                                    ${project.methodologies?.length ? `<p><strong>${this.labels.methodologies}:</strong> ${(project.methodologies || []).join(', ')}</p>` : ''}
                                    <p><strong>${this.labels.develop_technologies}:</strong> ${(project.develop_technologies || []).join(', ')}</p>
                                    ${project.integrations?.length ? `<p><strong>${this.labels.integrations}:</strong> ${(project.integrations || []).join(', ')}</p>` : ''}
                                    ${project.lang[this.language].description ? `<p><strong>${this.labels.description}:</strong> ${project.lang[this.language].description}</p>` : ''}
                                </div>`
                            ).join('')}
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
        },
        changeLanguage() {
            this.loadLanguageFiles();
        }
    }
});
