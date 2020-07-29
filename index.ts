import imagemin from 'imagemin'
import imageminMozjpeg from 'imagemin-mozjpeg'
import imageminPngquant from 'imagemin-pngquant'
import imageminGifsicle from 'imagemin-gifsicle'
import imageminSvgo from 'imagemin-svgo'
import { exec } from 'child_process'
import path from 'path'

const optimize = async (inputPath: string, destinationPath: string) => {
  const response = await imagemin([`${inputPath}/*.{jpg,jpeg,png,gif,svg}`], {
    destination: destinationPath,
    plugins: [
      imageminMozjpeg({ quality: 80 }),
      imageminPngquant({ quality: [0.65, 0.8] }),
      imageminGifsicle(),
      imageminSvgo(),
    ],
  })

  const optimizedImages = response.map((data) => data.sourcePath)
  optimizedImages.forEach((image) => {
    exec(`rm ${image}`, (error) => {
      if (error) {
        console.error(error)
        return
      }
      console.log(`optimize ${image}`)
    })
  })
}

;(async () => {
  const assets = path.resolve(__dirname, 'assets')
  const dist = path.resolve(__dirname, 'dist')
  // TODO: dist の中身を削除する
  await optimize(assets, dist)
})()
