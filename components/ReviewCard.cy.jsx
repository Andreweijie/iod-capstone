import React from 'react'
import { ReviewCard } from './ReviewCard'

describe('<ReviewCard />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<ReviewCard />)
  })
})