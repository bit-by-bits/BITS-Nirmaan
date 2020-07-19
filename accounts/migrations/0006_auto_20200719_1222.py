# Generated by Django 2.2.11 on 2020-07-19 06:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_auto_20200719_1219'),
    ]

    operations = [
        migrations.AlterField(
            model_name='volunteer',
            name='bits_email',
            field=models.EmailField(max_length=254, null=True, verbose_name='bits_email'),
        ),
        migrations.AlterField(
            model_name='volunteer',
            name='name',
            field=models.CharField(default='Name', max_length=50, verbose_name='name'),
        ),
        migrations.AlterField(
            model_name='volunteer',
            name='year',
            field=models.IntegerField(default=1, verbose_name='year'),
        ),
    ]
