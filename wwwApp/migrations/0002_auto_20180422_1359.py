# Generated by Django 2.0.4 on 2018-04-22 13:59

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('wwwApp', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='airport',
            name='passengers_limit',
        ),
        migrations.AddField(
            model_name='plane',
            name='passengers_limit',
            field=models.IntegerField(default=1000),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='airport',
            name='name',
            field=models.CharField(max_length=50, verbose_name='Lotnisko'),
        ),
        migrations.AlterField(
            model_name='flight',
            name='destination_time',
            field=models.DateTimeField(verbose_name='Czas dotarcia'),
        ),
        migrations.AlterField(
            model_name='flight',
            name='plane',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='wwwApp.Plane', verbose_name='Samolot'),
        ),
        migrations.AlterField(
            model_name='flight',
            name='starting_time',
            field=models.DateTimeField(verbose_name='Czas odlotu'),
        ),
        migrations.AlterField(
            model_name='plane',
            name='name',
            field=models.CharField(max_length=50, verbose_name='Samolot'),
        ),
    ]
