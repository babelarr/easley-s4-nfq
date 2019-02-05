import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import "./App.scss";
import Header from "./components/Header";
import Summary from "./components/Summary";
import Footer from "./components/Footer";
import DetailsContainer from "./components/DetailsContainer";
import { getPullRequestInfo, prEndpoint } from "./Services/RepositoryService";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pullRequests: [],
      reviewers: []
    };
    this.handleDate = this.handleDate.bind(this);
  }

  componentDidMount() {
    getPullRequestInfo()
    .then(data => {
      const pullRequestInfo = data.values.map((item, index) => {
        return {
          id: item.id,
          state: item.state,
          date: item.created_on,
          title: item.title,
          author: item.author.display_name,
          comments_number: item.comment_count,
          avatar: item.author.links.avatar.href,
          branch: item.source.branch.name,
          develop: item.destination.branch.name,
          uriReviewer: prEndpoint + item.id
        };
      });
      this.setState({
        pullRequests: pullRequestInfo
      });

      const uriReviewer = this.state.pullRequests[0].uriReviewer;
      console.log("uriReviewer", uriReviewer);
      console.log("state pullrequests", this.state.pullRequests);

      fetch(uriReviewer)
        .then(response => response.json())
        .then(data => {
          console.log("data uriReviewer", data);
          const pullRequestReviewer = data.reviewers.map((item, index) => {
            return {
              reviewer_name: item.display_name,
              reviewer_avatar: item.links.avatar.href
            };
          });
          this.setState({
            reviewers: pullRequestReviewer
          });
          console.log(this.state.reviewers);
        });
    });
  }

  handleDate(date) {
    let newDate = date.substring(0, 10);
    newDate = newDate.split("-");
    newDate = newDate.reverse();
    const dayDate = parseInt(newDate[0]);
    const monthDate = parseInt(newDate[1]);
    const yearDate = parseInt(newDate[2]);
    newDate = newDate.join("-");
    const infoDate = {
      date: newDate,
      day: dayDate,
      month: monthDate,
      year: yearDate
    };
    return infoDate;
  }

  render() {
    const { pullRequests } = this.state;
    const creationDate = this.handleDate();

    return (
      <div className="App">
        })}
        <Header />
        <main>
          <Switch>
            <Route
              exact
              path="/summary"
              render={() => {
                return <Summary />;
              }}
            />
            <Route
              exact
              path="/"
              render={() => {
                return <DetailsContainer pullRequests={pullRequests} creationDate={creationDate}/>;
              }}
            />
          </Switch>
        </main>

        <Footer />
      </div>
    );
  }
}

export default App;
