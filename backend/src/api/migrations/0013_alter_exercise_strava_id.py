# Generated by Django 4.2.1 on 2023-06-06 14:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_alter_exercise_options_alter_map_polyline_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='exercise',
            name='strava_id',
            field=models.CharField(blank=True, null=True, max_length=100),
        ),
    ]
