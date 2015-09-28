from geopy.distance import vincenty

def get_hot_points(data, threshold, distance):
    """get hot point"""
    hot_points = []
    for each in data:
        count = 0
        p1 = (each[-2], each[-1]) # lat, lng
        for item in data:
            p2 = (item[-2], item[-1])
            p_dis = vincenty(p1, p2).meters
            if p_dis < distance:
                count += 1
                if count > threshold:
                    tmp = each.copy()
                    tmp.append(count)
                    hot_points.append(tmp)
                    break
    return hot_points
