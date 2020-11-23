import * as React from "react";
import './App.css';

function App() {


  const [user, setUser] = React.useState([]);
  const [currentUser, setCurrentUser] = React.useState('');
  const [followers, setFollowers] = React.useState([]);
  const [display, setdisplay] = React.useState('user');
  const [currentRepo, setcurrentRepo] = React.useState('');


  const InputgetUser = (e) => {
    const formData = new FormData(e.target);
    e.preventDefault();
    const UName = formData.get('UName');
    getUser(UName)
  }


  const getUser = (UName) => {
    if (!userExists(UName, user)) {
      fetch(`https://api.github.com/users/${UName}/repos`).then(
        (res) => {
          res.json().then(
            (data) => {
              console.log(data);
              if (data.message !== "Not Found") {

                const response = {
                  UName: data[0].owner.login,
                  response: data
                };
                setUser(user => user.concat(response));
                setCurrentUser(data[0].owner.login);
                fetchSetFollowers(data[0].owner.login, data[0].owner.followers_url)
                setdisplay('user');

              } else {
                console.log('User not found');        //keep this log
              }
            }
          )
        }
      );
    } else {
      console.log('user alredy exists');      //keep this log
      setCurrentUser(UName);
      setdisplay('user');

    }
  }


  //checks if user already exists in a state
  const userExists = (name, state) => {
    var found = false;
    for (var i = 0; i < state.length; i++) {
      if (state[i].UName === name) {
        found = true;
        break;
      }
    }
    return found;
  }

  //finding a user that exists
  const findCurrentUser = (name, state) => {
    for (var i = 0; i < state.length; i++) {
      if (state[i].UName == name) {
        return state[i].response;
      }
    }
  }


  const fetchSetFollowers = (user, url) => {
    fetch(url).then(
      (res) => {
        res.json().then(
          (data) => {
            const follow = {
              UName: user,
              response: data
            }
            if (!userExists(user, followers)) {
              setFollowers(followers => followers.concat(follow));
            }
          }
        );
      }
    );
  }

  const displayUser = () => {
    if (display != 'user') {
      return;
    } else {
      if (currentUser !== '') {
        const repos = []
        console.log(findCurrentUser(currentUser, user)[0].owner.avatar_url);
        findCurrentUser(currentUser, user).forEach(element => {
          repos.push(
            <div className='repoCard' onClick={e => {
              setdisplay('repo');
              setcurrentRepo(element.name)
            }}>
              <img src={element.owner.avatar_url} alt="" className="img" />
              <div className="head">
                {element.name}
              </div>
              <div className="description">
                {element.description}
              </div>
            </div>
          )
        });
        return (
          <div>
            <div>
              <h1>{currentUser}</h1>
            </div>
            <div className="dispUser">
              {repos.map(res => res)}
            </div>
          </div>
        )
      }
    }

  }

  const displayFollowers = () => {
    if (display != 'followers') {
      return;
    } else {
      if (userExists(currentUser, followers)) {
        const follow = [];
        console.log(findCurrentUser(currentUser, followers));
        findCurrentUser(currentUser, followers).forEach(element => {
          follow.push(
            <div onClick={e => getUser(element.login)} className='repoCard'>
              <div className='head'>{element.login}</div>
              <img src={element.avatar_url} alt="" className='img' />
            </div>
          )
        })
        return (
          <div>
            <div className='dispUser'>
              {
                follow.map(element => element)
              }
            </div>
            <div onClick={e => setdisplay('user')} className='back'>
              back
            </div>
          </div>
        )
      }
    }
  }

  const findRepo = (Reponame) => {
    const array = findCurrentUser(currentUser, user);
    console.log(Reponame);
    for (var i = 0; i < array.length; i++) {
      if (array[i].name == Reponame) {
        return array[i];
      }
    }
  }

  const repoInfo = () => {
    if (display != 'repo') {
      return;
    } else {
      return (
        <div>
          <div className='repo'>
            <div >
              <img src={findRepo(currentRepo).owner.avatar_url} alt="" className = 'repo_image'/>
            </div>
            <div className = 'repoName'>
              {findRepo(currentRepo).name}
            </div>
            <div className='repoDscp'>
              {findRepo(currentRepo).description}
            </div>
            <div className='categories'>
              {findRepo(currentRepo).language}
            </div>
          </div>
          <div onClick={e => setdisplay('user')} className='back'>
            back
          </div>
        </div>
      )
    }
  }

  const showFollowers = () => {
    return (currentUser != '' && display == 'user' &&
      <div onClick={e => setdisplay('followers')} className='followers'>
        followers
      </div>
    );
  }

  return (
    <div className="App">
      <form onSubmit={InputgetUser} >
        <input type="text" name="UName" placeholder="Enter UserName" />
        <input type="submit" value="Submit" />
      </form>
      {displayUser()}
      {showFollowers()}
      {displayFollowers()}
      {repoInfo()}
    </div>
  );
}

export default App;
