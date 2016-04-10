class User < ActiveRecord::Base
  validates :username, uniqueness: true
  validates :username, :password, presence: true
  has_many :restaurants
  has_many :reviews, class_name: "Review", foreign_key: "reviewer_id"

  def password
    @password ||= BCrypt::Password.new(encrypted_password)
  end

  def password=(new_password)
    @password = BCrypt::Password.create(new_password)
    self.encrypted_password = @password
  end

  def authenticate(password)
    self.password == password
  end
end
