document.addEventListener('DOMContentLoaded', () => {
    const commentForm = document.getElementById('comment-form');
    const commentsList = document.getElementById('comments-list');

    const loadComments = () => {
        const comments = JSON.parse(localStorage.getItem('comments')) || [];
        commentsList.innerHTML = '';
        comments.forEach(comment => renderComment(comment, commentsList));
    };

    const saveComments = (comments) => {
        localStorage.setItem('comments', JSON.stringify(comments));
    };

    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const commentText = document.getElementById('comment').value;
        if (name && commentText) {
            const comments = JSON.parse(localStorage.getItem('comment')) || [];
            const newComment = { name, text: commentText, replies: [] };
            comments.push(newComment);
            saveComments(comments);
            renderComment(newComment, commentsList);
            commentForm.reset();
        }
    });

    const renderComment = (comment, parentElement) => {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';
        commentDiv.innerHTML = `
            <p class="name">${comment.name}</p>
            <p class="text">${comment.text}</p>
            <button class="reply-btn">Reply</button>
            <div class="replies"></div>
        `;

        const repliesDiv = commentDiv.querySelector('.replies');
        comment.replies.forEach(reply => renderReply(reply, repliesDiv));

        commentDiv.querySelector('.reply-btn').addEventListener('click', () => {
            const replyForm = document.createElement('form');
            replyForm.innerHTML = `
                <input type="text" placeholder="Your name" required>
                <textarea placeholder="Your reply" required></textarea>
                <button type="submit">Post Reply</button>
            `;
            replyForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const replyName = replyForm.querySelector('input').value;
                const replyText = replyForm.querySelector('textarea').value;
                if (replyName && replyText) {
                    const reply = { name: replyName, text: replyText, replies: [] };
                    comment.replies.push(reply);
                    saveComments(JSON.parse(localStorage.getItem('comments')));
                    renderReply(reply, repliesDiv);
                    replyForm.remove();
                }
            });
            repliesDiv.appendChild(replyForm);
        });

        parentElement.appendChild(commentDiv);
    };

    const renderReply = (reply, parentElement) => {
        const replyDiv = document.createElement('div');
        replyDiv.className = 'reply';
        replyDiv.innerHTML = `
            <p class="name">${reply.name}</p>
            <p class="text">${reply.text}</p>
        `;
        parentElement.appendChild(replyDiv);
    };

    loadComments();
});
