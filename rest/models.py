from django.db import models

# Create your models here.
class Code(models.Model):
    name = models.CharField(max_length=20, blank=True)
    code = models.TextField()