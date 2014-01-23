convert ${1%.*}.eps ${1%.*}.png
convert -rotate +90 ${1%.*}.png ${1%.*}.png
convert -trim ${1%.*}.png ${1%.*}.png
