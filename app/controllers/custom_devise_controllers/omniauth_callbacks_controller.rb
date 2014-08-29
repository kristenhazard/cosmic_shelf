class CustomDeviseControllers::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def self.provides_callback_for(provider)
    class_eval %Q{
      def #{provider}
        @user = User.from_omniauth(request.env["omniauth.auth"])

        if @user.persisted?
          sign_in_and_redirect @user, event: :authentication
          #sign_in @user, event: :authentication
          #redirect_to after_sign_in_path_for(@user)
          set_flash_message(:notice, :success, kind: "#{provider}".capitalize) if is_navigational_format?
        else
          session["devise.#{provider}_data"] = env["omniauth.auth"]
          redirect_to new_user_registration_url
        end
      end
    }
  end

  [:twitter, :facebook].each do |provider|
    provides_callback_for provider
  end
end
