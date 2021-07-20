# Geez, how do you even comment in Python files again? Been a while!
#
# For the mathier bits of this I found that the Astropy project has
# some good tools for generating convolutional image filters
#
# We'll try an Airy Disk kernal (refaction pattern) and a Ricker wavelet kernel
# I have the idea that "dimming" the image, by subtracting a constant brightness,
# and putting some negative feedback in with the positive, might produce some
# better feedback effects.
#
# I will also try adding in some Gaussian noise.
from astropy.convolution import AiryDisk2DKernel
import matplotlib.pyplot as plt
import json

knl = AiryDisk2DKernel(2)
# the 2-d array has dimension 17 * 17
# plot a cross section for inspection

fig, ax = plt.subplots()
ax.plot(knl.array[8])

plt.show()
