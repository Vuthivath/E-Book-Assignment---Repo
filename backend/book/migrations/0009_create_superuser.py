from django.db import migrations

def create_superuser(apps, schema_editor):
    from django.contrib.auth import get_user_model
    User = get_user_model()
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@admin.com', 'admin123')

class Migration(migrations.Migration):
    dependencies = [
        ('book', '0008_alter_order_status'),
    ]
    operations = [
        migrations.RunPython(create_superuser),
    ]