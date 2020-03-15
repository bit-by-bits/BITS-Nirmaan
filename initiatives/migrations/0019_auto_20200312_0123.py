# Generated by Django 2.2 on 2020-03-11 19:53

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('initiatives', '0018_auto_20200310_1323'),
    ]

    operations = [
        migrations.AlterField(
            model_name='initiative',
            name='date_started',
            field=models.DateField(default=datetime.datetime(2020, 3, 11, 19, 53, 47, 299176, tzinfo=utc), verbose_name='Start Date'),
        ),
        migrations.AlterField(
            model_name='initiativecomment',
            name='published_on',
            field=models.DateField(default=datetime.datetime(2020, 3, 11, 19, 53, 47, 387020, tzinfo=utc)),
        ),
    ]
