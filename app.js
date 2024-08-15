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
        },
        gitHubRepositories: [],
        projects: [],
        companies: [],
        clients: [],
        technologies: [],
        showNotification: true,
        currentComponent: 'companies',
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
                })
                .catch(error => console.error(error));

            fetch(projectsFile)
                .then(response => response.json())
                .then(data => {
                    this.projects = data;
                    this.processTechnologies();
                    this.populateCompaniesAndClients();
                })
                .catch(error => console.error(error));
        },
        getGitHubRepositories() {
            fetch(`${gitHubApiUrl}/users/leosfont/repos`)
                .then(response => response.json())
                .then(data => {
                    this.gitHubRepositories = data;
                })
                .catch(error => console.error(error));
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
        populateCompaniesAndClients() {
            const companies = {};
            const clients = {};

            this.projects.forEach(project => {
                const { company, type, develop_technologies, devops_technologies, duration, methodologies } = project;

                if (type === 'company') {
                    if (!companies[company]) {
                        companies[company] = {
                            develop_technologies: new Set(),
                            devops_technologies: new Set(),
                            methodologies: new Set(),
                            durations: []
                        };
                    }

                    develop_technologies.forEach(tech => companies[company].develop_technologies.add(tech));
                    devops_technologies.forEach(devops => companies[company].devops_technologies.add(devops));
                    methodologies.forEach(metho => companies[company].methodologies.add(metho));
                }

                if (type === 'client') {
                    if (!clients[company]) {
                        clients[company] = {
                            develop_technologies: new Set(),
                            devops_technologies: new Set(),
                            methodologies: new Set(),
                            durations: []
                        };
                    }
                    develop_technologies.forEach(tech => clients[company].develop_technologies.add(tech));
                    devops_technologies.forEach(devops => clients[company].devops_technologies.add(devops));
                    methodologies.forEach(metho => clients[company].methodologies.add(metho));
                }
                
                if (type === 'company') {
                    companies[company].durations.push(duration);
                }

                if (type === 'client') {
                    clients[company].durations.push(duration);
                }
            });

            this.clients = Object.entries(clients).map(([company, data]) => ({
                name: company,
                develop_technologies: Array.from(data.develop_technologies),
                devops_technologies: Array.from(data.devops_technologies),
                methodologies: Array.from(data.methodologies),
                duration: this.formatDurationRange(data.durations)
            }));

            this.companies = Object.entries(companies).map(([company, data]) => ({
                name: company,
                develop_technologies: Array.from(data.develop_technologies),
                devops_technologies: Array.from(data.devops_technologies),
                methodologies: Array.from(data.methodologies),
                duration: this.formatDurationRange(data.durations)
            }));
        },
        formatDurationRange(durations) {
            const years = durations.map(duration => {
                const year = parseInt(duration);
                return { start: year, end: year };
            });

            const startYear = Math.min(...years.map(year => year.start));
            const endYear = Math.max(...years.map(year => year.end));
            if (startYear != endYear) {
                return `${startYear} - ${endYear}`;
            } else {
                return `${startYear}`
            }
            
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
                            <h2 class="text-2xl font-semibold mt-4">${this.labels.companies_i_worked_on}</h2>
                            ${this.companies.map(company => 
                                `<div class="mb-8 pb-4 border-b border-gray-300">
                                    <h3 class="text-xl font-semibold mb-2 text-indigo-600">${company.name}</h3>
                                    <p class="text-gray-700"><strong>${this.labels.duration}:</strong> ${company.duration}</p>
                                    <div class="bg-indigo-50 p-4 rounded-lg">
                                        <h4 class="text-lg font-medium text-indigo-700 mb-2">${this.labels.projects}</h4>
                                        ${this.projects.map(project => project.type === 'company' && project.company === company.name ?
                                        `<div class="mb-4">
                                            <strong class="block mb-2 text-indigo-900">${project.lang[this.language].project_name}</strong>
                                            ${project.image ? `<img src="${project.image}" alt="Project Image" class="max-w-xs mb-4 rounded-lg shadow-lg">` : ''}
                                            <p class="text-gray-600"><strong>${this.labels.duration}:</strong> ${this.formatDurationRange(project.duration)}</p>
                                            <p class="text-gray-600"><strong>${this.labels.devops_technologies}:</strong> ${(project.devops_technologies || []).join(', ')}</p>
                                            ${project.methodologies?.length ? `<p class="text-gray-600"><strong>${this.labels.methodologies}:</strong> ${(project.methodologies || []).join(', ')}</p>` : ''}
                                            <p class="text-gray-600"><strong>${this.labels.develop_technologies}:</strong> ${(project.develop_technologies || []).join(', ')}</p>
                                            ${project.integrations?.length ? `<p class="text-gray-600"><strong>${this.labels.integrations}:</strong> ${(project.integrations || []).join(', ')}</p>` : ''}
                                            <p class="text-gray-600"><strong>${this.labels.description}:</strong> ${project.lang[this.language].description}</p>
                                        </div>` : '').join('')}
                                    </div>
                                </div>`
                            ).join('')}
                        </section>
        
                        <section>
                            <h2 class="text-2xl font-semibold mt-4">${this.labels.clients_i_worked_on}</h2>
                            ${this.clients.map(client => 
                                `<div class="mb-8 pb-4 border-b border-gray-300">
                                    <h3 class="text-xl font-semibold mb-2 text-green-600">${client.name}</h3>
                                    <p class="text-gray-700"><strong>${this.labels.duration}:</strong> ${client.duration}</p>
                                    <div class="bg-green-50 p-4 rounded-lg">
                                        <h4 class="text-lg font-medium text-green-700 mb-2">${this.labels.projects}</h4>
                                        ${this.projects.map(project => project.type === 'client' && project.company === client.name ?
                                        `<div class="mb-4">
                                            <strong class="block mb-2 text-green-900">${project.lang[this.language].project_name}</strong>
                                            ${project.image ? `<img src="${project.image}" alt="Project Image" class="max-w-xs mb-4 rounded-lg shadow-lg">` : ''}
                                            <p class="text-gray-600"><strong>${this.labels.duration}:</strong> ${this.formatDurationRange(project.duration)}</p>
                                            <p class="text-gray-600"><strong>${this.labels.devops_technologies}:</strong> ${(project.devops_technologies || []).join(', ')}</p>
                                            ${project.methodologies?.length ? `<p class="text-gray-600"><strong>${this.labels.methodologies}:</strong> ${(project.methodologies || []).join(', ')}</p>` : ''}
                                            <p class="text-gray-600"><strong>${this.labels.develop_technologies}:</strong> ${(project.develop_technologies || []).join(', ')}</p>
                                            ${project.integrations?.length ? `<p class="text-gray-600"><strong>${this.labels.integrations}:</strong> ${(project.integrations || []).join(', ')}</p>` : ''}
                                            <p class="text-gray-600"><strong>${this.labels.description}:</strong> ${project.lang[this.language].description}</p>
                                        </div>` : '').join('')}
                                    </div>
                                </div>`
                            ).join('')}
                        </section>
                    </body>
                </html>
            `;

            const blob = new Blob([html], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
        
            const printWindow = window.open(url, '', 'height=600,width=800');
            printWindow.document.open();
            printWindow.document.write(html);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();

            URL.revokeObjectURL(url);
        },        
        changeLanguage() {
            this.loadLanguageFiles();
        }
    }
});
