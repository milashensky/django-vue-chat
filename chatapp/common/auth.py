from django.contrib.auth import login, logout
from django.contrib.auth.models import User

from common.mixins import CsrfExemptMixin, SerializedView
from common.forms import UserCreationForm


class LoginApi(SerializedView):

    def post(self, request):
        if self.request.user.is_authenticated:
            return {'state': True}
        user = User.objects.filter(email=self.data.get('email')).first()
        if user and user.check_password(self.data.get('password')):
            login(self.request, user)
            return {'id': user.id}
        self.status = 400
        return {'errors': {'__all__': ['Incorrect email or password']}}


class LogoutApi(CsrfExemptMixin, SerializedView):

    def post(self, request):
        logout(self.request)
        return {'state': True}


class RegistrationApi(SerializedView):

    def post(self, request):
        form = UserCreationForm(self.data)
        if form.is_valid():
            user = form.save()
            login(self.request, user)
            return {'id': user.id}
        self.status = 400
        return {'errors': form.errors}
