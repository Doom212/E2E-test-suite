/**
 * Centralized test data. Keeping fixtures separate from specs means
 * one place to update credentials/products if the target app changes.
 */
export const users = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  lockedOut: { username: 'locked_out_user', password: 'secret_sauce' },
  problem: { username: 'problem_user', password: 'secret_sauce' },
  glitch: { username: 'performance_glitch_user', password: 'secret_sauce' },
  invalid: { username: 'not_a_real_user', password: 'wrong_password' },
};

export const products = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
  boltTShirt: 'Sauce Labs Bolt T-Shirt',
};

export const checkoutInfo = {
  valid: { firstName: 'Ada', lastName: 'Lovelace', postalCode: '90210' },
};
