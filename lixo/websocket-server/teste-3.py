"Dynamic plotting in matplotlib. Copy and paste into a Jupyter notebook."
# written October 2016 by Sam Greydanus
import matplotlib.pyplot as plt
import numpy as np
import time
import mpld3

def plt_dynamic(x, y, ax, colors=['b']):
    for color in colors:
        ax.plot(x, y, color)
    fig.canvas.draw()

    html_str = mpld3.fig_to_html(fig)
    Html_file= open("./static/fig.html","w")
    Html_file.write(html_str)
    Html_file.close()
    
fig,ax = plt.subplots(1,1)
ax.set_xlabel('X') ; ax.set_ylabel('Y')
ax.set_xlim(0,360) ; ax.set_ylim(-1,1)
xs, ys = [], []

# this is any loop for which you want to plot dynamic updates.
# in my case, I'm plotting loss functions for neural nets
for x in range(360):
    y = np.sin(x*np.pi/180)
    xs.append(x)
    ys.append(y)
    if x % 30 == 0:
        plt_dynamic(xs, ys, ax)
        time.sleep(1)
plt_dynamic(xs, ys, ax)

