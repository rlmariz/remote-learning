from matplotlib.pyplot import figure
import mpld3

fig1 = figure()
ax = fig1.gca()
ax.plot([1,2,3,4])

fig2 = figure()
ax = fig2.gca()
ax.plot([1,2,3,4])

########################
#Import dependencies
########################

import pandas as pd
import matplotlib.pyplot as plt
import mpld3

# mpld3.show(fig1, fig2)

html_str = mpld3.fig_to_html(fig1)
Html_file= open("fig.html","w")
Html_file.write(html_str)
Html_file.close()
