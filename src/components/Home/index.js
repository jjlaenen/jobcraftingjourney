import React, { Component } from 'react';
import JobDemandsResourcesLayout from './jobDemandsResourcesLayout';
import HomeDemandsResourcesLayout from './homeDemandsResourcesLayout';
import Personal from './personalResourcesLayout';
import ChallengesFormRead from './challengeFormRead';
import ChallengesFormWriteLayout from './challengeFormWriteLayout';

export default class HomePage extends Component {
  render() {
    return (
      <div>
        <JobDemandsResourcesLayout />
        <HomeDemandsResourcesLayout />
        <Personal />
        <ChallengesFormRead />
        <ChallengesFormWriteLayout />
      </div>
    );
  }
}