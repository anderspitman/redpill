class Fetcher {
  fetchLines() {
    throw "fetchLines must be overridden in subclass"
  }
}

class GitHubFetcher extends Fetcher {
  constructor(options) {
    super()

    const username = options.githubUsername

    const headers = new Headers()

    const fetchOptions = { headers }

    options.fetchOptions = fetchOptions

    this._linesPromise = fetch(`https://api.github.com/users/${username}/repos?sort=pushed`, fetchOptions)
    .then((response) => {
      return response.json()
    })
    .then((repos) => {
      console.log(repos)
      return getLinesFromRepos(repos, options)
    }) 
    .catch((err) => {
      console.error(err)
    })
  }

  fetchLines() {
    return this._linesPromise
  }
}

function getLinesFromRepos(repos, options) {

  let repoIndex = 0
  let repo = repos[repoIndex]
  let totalLines = [];
  
  return new Promise((resolve, reject) => {

    function getLines() {
      getLinesFromRepo(repo, options)
      .then((lines) => {
        totalLines = totalLines.concat(lines)

        if (totalLines.length >= options.numLines) {
          resolve(totalLines)
        }
        else {
          repoIndex++
          repo = repos[repoIndex]
          getLines()
        }
      })
    }

    getLines()

  })

  //const firstRepo = repos[0]
  //return getLinesFromRepo(firstRepo, options)
}

function getLinesFromRepo(repo, options) {
  const commitsUrl = repo.url + '/commits'

  if (!options.excludeFileTypes) {
    options.excludeFileTypes = []
  }

  return fetch(commitsUrl, options.fetchOptions)
  .then((response) => {
    return response.json()
  })
  .then((commits) => {
    // only check the most recent commit in each repo. creates more diversity
    // by pulling from different repos
    const firstCommit = commits[0]
    return fetch(firstCommit.url, options.fetchOptions)
  })
  .then((response) => {
    return response.json()
  })
  .then((commit) => {

    const lines = [];

    for (const file of commit.files) {
      const filenameParts = file.filename.split('.')
      const fileType = filenameParts[filenameParts.length - 1]

      if (file.patch && options.excludeFileTypes.indexOf(fileType) === -1) {
        for (const line of file.patch.split('\n')) {
          if (line.length >= 20 && line.startsWith('+')) {
            // skip the '+'
            lines.push(line.slice(1).trim())

            if (lines.length >= options.numLines) {
              break
            }
          }
        }
      }

      if (lines.length >= options.numLines) {
        break
      }
    }

    return lines
  })
  .catch((err) => {
    console.error(err)
  })
}

export function createFetcher(options) {
  switch(options.sourceType) {
    case 'github':
      return new GitHubFetcher(options)
      break
    default:
      throw "Invalid fetcher type: " + type
      break
  }
}
