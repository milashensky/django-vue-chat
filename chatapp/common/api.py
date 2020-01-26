from django.contrib.auth.models import User

from common.mixins import SerializedView, AuthRequierdMixin
from common.forms import UserChangeForm


class ContextApi(SerializedView):

    def get(self, request):
        user = request.user
        data = {
            'id': user.pk
        }
        if user.pk:
            data.update({
                'email': user.email,
                'username': user.username,
            })
        return data


class Users(AuthRequierdMixin, SerializedView):
    fields = ('id', 'username')

    def get(self, request):
        page = int(request.GET.get('page', 0))
        per_page = int(request.GET.get('per_page', 20))
        current = page * per_page
        qs = User.objects.all().exclude(id=request.user.id)
        return {'users': self.serialize_items(qs[current:current + per_page], self.fields), 'count': qs.count()}


class Profile(AuthRequierdMixin, SerializedView):

    def put(self, request):
        form = UserChangeForm(self.data, instance=request.user)
        if form.is_valid():
            user = form.save()
            return {'id': user.id}
        self.status = 400
        return {'errors': form.errors}
