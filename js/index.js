const form = document.getElementById('search-form');
const searchInput = document.getElementById('search');
const resultsDiv = document.getElementById('results');
const reposDiv = document.getElementById('repos');
const toggleButton = document.getElementById('toggle');

let searchMode = 'user'; // or 'repo'
fetch('https://api.github.com/search/users?q=octocat', {
    headers: {
      Accept: 'application/vnd.github.v3+json'
    }
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    });
  

toggleButton.addEventListener('click', () => {
  searchMode = searchMode === 'user' ? 'repo' : 'user';
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const query = searchInput.value;
  resultsDiv.innerHTML = '';
  reposDiv.innerHTML = '';
  if (searchMode === 'user') {
    fetch(`https://api.github.com/search/users?q=${query}`, {
      headers: { Accept: 'application/vnd.github.v3+json' }
    })
      .then(res => res.json())
      .then(data => {
        data.items.forEach(user => {
          const userDiv = document.createElement('div');
          userDiv.innerHTML = `
            <p><strong>${user.login}</strong></p>
            <img src="${user.avatar_url}" width="50" />
            <a href="${user.html_url}" target="_blank">Profile</a>
          `;
          userDiv.addEventListener('click', () => {
            fetch(`https://api.github.com/users/${user.login}/repos`)
              .then(res => res.json())
              .then(repos => {
                reposDiv.innerHTML = '<h3>Repositories:</h3>';
                repos.forEach(repo => {
                  const repoItem = document.createElement('p');
                  repoItem.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
                  reposDiv.appendChild(repoItem);
                });
              });
          });
          resultsDiv.appendChild(userDiv);
        });
      });
  } else {
    fetch(`https://api.github.com/search/repositories?q=${query}`, {
      headers: { Accept: 'application/vnd.github.v3+json' }
    })
      .then(res => res.json())
      .then(data => {
        data.items.forEach(repo => {
          const repoDiv = document.createElement('div');
          repoDiv.innerHTML = `
            <p><strong>${repo.full_name}</strong></p>
            <a href="${repo.html_url}" target="_blank">Repo Link</a>
          `;
          resultsDiv.appendChild(repoDiv);
        });
      });
  }
});
