
7.times {
  User.create(username: Faker::Internet.user_name,
  password: "password")
}
