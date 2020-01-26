from django import forms
from django.contrib.auth.forms import UserCreationForm as BacicUserCreationForm
from django.contrib.auth.models import User


class ValidateEmailMixin:

    def clean_email(self):
        email = self.cleaned_data.get('email', '')
        user_id = -1
        if hasattr(self, 'instance'):
            user_id = self.instance.id
        if User.objects.filter(email=email).exclude(id=user_id).count():
            raise forms.ValidationError('Email already in use.')
        return email


class UserCreationForm(BacicUserCreationForm, ValidateEmailMixin):
    email = forms.EmailField(required=True)

    class Meta:
        model = User
        fields = ('username', 'email')


class UserChangeForm(forms.ModelForm, ValidateEmailMixin):

    class Meta:
        model = User
        fields = ('username', 'email')
