export function createTasksModal(taskManager) {
    // Update the existing createTasksModal function to handle task redirects
    const modal = document.createElement('div');
    modal.className = 'tasks-modal';
    modal.innerHTML = `
        <div class="tasks-container">
            <div class="tasks-header">
                <h2><i class="fas fa-tasks"></i> Daily Tasks</h2>
                <button class="close-button"><i class="fas fa-times"></i></button>
            </div>
            
            <div class="tasks-list">
                ${taskManager.tasks.map(task => `
                    <div class="task-item ${task.isCompleted ? 'completed' : ''}">
                        <div class="task-icon">
                            <i class="${task.icon}"></i>
                        </div>
                        <div class="task-details">
                            <h3>${task.title}</h3>
                            <p>${task.description}</p>
                        </div>
                        <div class="task-reward">
                            <span>₹${task.reward}</span>
                            <button class="complete-task" data-task-id="${task.id}" 
                                    ${task.isCompleted ? 'disabled' : ''}>
                                ${task.isCompleted ? 'Completed' : 'Complete'}
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Add event listeners for task completion
    modal.querySelectorAll('.complete-task').forEach(button => {
        button.addEventListener('click', async () => {
            const taskId = button.dataset.taskId;
            const success = await taskManager.completeTask(taskId);
            
            if (success) {
                button.disabled = true;
                button.textContent = 'Completed';
                button.parentElement.parentElement.classList.add('completed');
                
                const popup = document.createElement('div');
                popup.className = 'task-complete-popup';
                popup.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <h3>Task Completed!</h3>
                    <p>₹${taskManager.tasks.find(t => t.id === taskId).reward} added to your wallet</p>
                `;
                document.body.appendChild(popup);
                
                // Remove popup after animation
                setTimeout(() => popup.remove(), 3000);
            }
        });
    });

    modal.querySelector('.close-button').addEventListener('click', () => {
        modal.remove();
    });

    return modal;
}