class User < ActiveRecord::Base
  has_many :books

  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :omniauthable, :omniauth_providers => [:facebook, :twitter]

  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.name = auth.info.name 
      user.email = auth.provider == 'twitter' ? "#{user.name.gsub(/\s+/, "")}@fake.com" : auth.info.email 
      user.password = Devise.friendly_token[0,20]
    end
  end
end