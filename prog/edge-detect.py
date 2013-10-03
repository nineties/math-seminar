import math
from PIL import Image
im = Image.open("image.jpg")
new = Image.new(im.mode, im.size, None)
ipix = im.load()
opix = new.load()
im.show()

for x in xrange(1, im.size[0]-1):
    for y in xrange(1, im.size[1]-1):
        dx = (ipix[x+1, y] - ipix[x-1, y])/2
        dy = (ipix[x, y+1] - ipix[x, y-1])/2
        opix[x, y] = math.sqrt(dx**2 + dy**2)
new.show()
